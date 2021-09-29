import React from "react";
import axios from "axios";

import { Diagnosis, Entry, Gender, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { addEntry, setDiagnosesList, setPatientInfo, useStateValue } from "../state";
import { useParams } from "react-router";
import { Button, Container, Icon } from "semantic-ui-react";
import HospitalSegment from "./HospitalSegment";
import HealthCheckSegment from "./HealthCheckSegment";
import OccupationalHealthcareSegment from "./OccupationalHealthcareSegment";
import { assertNever } from "../utils";
import { AddEntryModal, EntryFormValues } from "../AddEntryModal/AddEntryModal";

const PatientPage = () => {
  const [{ patientInfo, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpenHealthCheck, setModalOpenHealthCheck] = React.useState<boolean>(false);
  const [modalOpenHospital, setModalOpenHospital] = React.useState<boolean>(false);
  const [modalOpenHealthcare, setModalOpenHealthcare] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModalHealthCheck = (): void => setModalOpenHealthCheck(true);
  const openModalHospital = (): void => setModalOpenHospital(true);
  const openModalHealthcare = (): void => setModalOpenHealthcare(true);

  const closeModalHealthCheck = (): void => {
    setModalOpenHealthCheck(false);
    setError(undefined);
  };
  const closeModalHospital = (): void => {
    setModalOpenHospital(false);
    setError(undefined);
  };
  const closeModalHealthcare = (): void => {
    setModalOpenHealthcare(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(updatedPatient));
      closeModalHealthCheck();
      closeModalHospital();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };
  
  const patient: Patient = patientInfo[id];
  
  React.useEffect(() => {
    const fetchPatientInformation = async () => {
      try {
        const { data: patientInformationFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatientInfo(patientInformationFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    const fetchDiagnosesList = async () => {
      try {
        const { data: diagnosesListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosesList(diagnosesListFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    if (!patient) {
      void fetchPatientInformation();
    }

    if (Object.keys(diagnoses).length === 0) {
      void fetchDiagnosesList();
    }
    
  }, [dispatch, id]);

  const GenderIcon: React.FC<{ gender: Gender }> = ({ gender }) => {
    switch (gender) {
      case Gender.Male:
        return <Icon name='mars' />;
      case Gender.Female:
        return <Icon name='venus' />;
      case Gender.Other:
        return <Icon name='genderless' />;
      default:
        return assertNever(gender);
    }
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalSegment entry={entry} />;
      case "HealthCheck":
        return <HealthCheckSegment entry={entry} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareSegment entry={entry} />;
      default:
        return assertNever(entry);
    }
  };
  
  if (patient && diagnoses) {
    return (
      <div className="App">
        <Container textAlign="left">
          <h2>
            {patient.name}
            <GenderIcon gender={patient.gender} />
          </h2>
          <p>
            ssn: {patient.ssn} <br />
            occupation: {patient.occupation}
          </p>
          <AddEntryModal
            entryType="HealthCheck"
            modalOpen={modalOpenHealthCheck}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModalHealthCheck}
          />
          <AddEntryModal
            entryType="Hospital"
            modalOpen={modalOpenHospital}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModalHospital}
          />
          <AddEntryModal
            entryType="OccupationalHealthcare"
            modalOpen={modalOpenHealthcare}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModalHealthcare}
          />
          <Button onClick={() => openModalHealthCheck()}>Add New HealthCheck Entry</Button>
          <Button onClick={() => openModalHospital()}>Add New Hospital Entry</Button>
          <Button onClick={() => openModalHealthcare()}>Add New Healthcare Entry</Button>
          <h3>entries</h3>
          {patient.entries?.map(e => <EntryDetails key={e.id} entry={e} />)}
        </Container>
      </div>
    );
  } else {
    return null;
  }
};

export default PatientPage;