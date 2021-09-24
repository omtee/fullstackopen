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
import AddEntryModal from "../AddEntryModal";
import { EntryHealthCheckFormValues } from "../AddEntryModal/AddHealthCheckEntryForm";

const PatientPage = () => {
  const [{ patientInfo, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryHealthCheckFormValues) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(updatedPatient));
      closeModal();
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
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
          />
          <Button onClick={() => openModal()}>Add New Entry</Button>
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