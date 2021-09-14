import { v1 as uuid } from 'uuid';

import patientData from '../../data/patients.json';

import { Patient, NonSensitivePatient, NewPatient } from '../../types';

const getEntries = (): Array<Patient> => {
  return patientData;
};

const getNonSensitiveEntries = (): Array<NonSensitivePatient> => {
    return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    }));
};

const addEntry = ( entry: NewPatient ): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const id: string = uuid();
  const newPatient = {
    id,
    ...entry
  };
  patientData.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addEntry
};