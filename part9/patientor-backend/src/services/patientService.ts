import { v1 as uuid } from 'uuid';

import { patients } from '../../data/patients';

import { Patient, NonSensitivePatient, NewPatient, EntryWithoutId } from '../types';

const getPatients = (): Array<Patient> => {
  return patients;
};

const getPatient = (id: string) => {
  return patients.find(p => p.id.toString() === id.toString());
};

const getNonSensitivePatients = (): Array<NonSensitivePatient> => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id: string = uuid();
  const newPatient = {
    id,
    ...patient,
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Patient => {
  const patient = patients.find(p => p.id.toString() === patientId.toString());

  if(!patient) {
    throw new Error(`Could not find patient for id ${patientId}`);
  }

  const id: string = uuid();
  const newEntry = { id, ...entry };
  
  patient.entries = patient.entries.concat(newEntry);
  
  return patient;
};

export default {
  getPatients,
  getPatient,
  getNonSensitivePatients,
  addPatient,
  addEntry
};