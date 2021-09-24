import { Gender, NewPatient, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry, HealthCheckRating } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isArrayOfStrings = (textArray: unknown): textArray is Array<string> => {
  return Array.isArray(textArray) && textArray.every(text => isString(text));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth)) {
    throw new Error('Incorrect or missing date of birth');
  }
  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

type PatientFields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: PatientFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    ssn: parseSsn(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation)
  };
  return newPatient;
};

const parseId = (id: unknown): string => {
  if (!id || !isString(id)) {
    throw new Error('Incorrect or missing id');
  }
  return id;
};

export const toId = (id: unknown): string => {
  const parsedId: string = parseId(id);
  return parsedId;
};

export const parseType = (type: unknown): string => {
  if (!type || !isString(type)) {
    throw new Error('Incorrect or missing type');
  }
  return type;
};

const parseEntryDate = (date: unknown): string => {
  if (!date || !isString(date)) {
    throw new Error('Incorrect or missing entry date');
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseDiagnosisCodes = (codes?: Array<unknown>): Array<string> | undefined => {
  if (!codes) {
    return undefined;
  }
  if (!isArrayOfStrings(codes)) {
    throw new Error('DiagnosisCodes is not array of strings');
  }
  return codes;
};

const parseDischarge = ({ date, criteria }: { date: unknown, criteria: unknown }):
  { date: string, criteria: string } => {
  const newDischarge = {
    date: parseDischargeDate(date),
    criteria: parseDischargeCriteria(criteria)
  };
  return newDischarge;
};

const parseDischargeDate = (date: unknown): string => {
  if (!date || !isString(date)) {
    throw new Error('Incorrect or missing discharge date');
  }
  return date;
};

const parseDischargeCriteria = (criteria: unknown): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error('Incorrect or missing discharge criteria');
  }
  return criteria;
};

const parseEmployerName = (emloyerName: unknown): string => {
  if (!emloyerName || !isString(emloyerName)) {
    throw new Error('Incorrect or missing emloyer name');
  }
  return emloyerName;
};

const parseSickLeave = (sickLeave: unknown): { startDate: string, endDate: string } | undefined => {
  if (sickLeave) {
    return parseStartAndEndDates((sickLeave as { startDate: unknown, endDate: unknown }));
  }
  return undefined;  
};

const parseStartAndEndDates = ({ startDate, endDate }: { startDate: unknown, endDate: unknown }) => {
  const newSickLeave = {
    startDate: parseSickLeaveStartDate(startDate),
    endDate: parseSickLeaveEndDate(endDate)
  };
  return newSickLeave;
};

const parseSickLeaveStartDate = (date: unknown): string => {
  if (!date || !isString(date)) {
    throw new Error('Incorrect or missing sick leave start date');
  }
  return date;
};

const parseSickLeaveEndDate = (date: unknown): string => {
  if (!date || !isString(date)) {
    throw new Error('Incorrect or missing sick leave end date');
  }
  return date;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (typeof rating === undefined || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating: ' + rating);
  }
  return rating;
};

/*
* NOT WORKING ??
interface BaseEntryFields {
  description: unknown,
  date: unknown,
  specialist: unknown,
  diagnosisCodes: unknown
}
interface HospitalEntryFieldsInt {
  type: HospitalEntry["type"],
  discharge: { date: unknown, criteria: unknown }
}
type HospitalEntryFields = BaseEntryFields | HospitalEntryFieldsInt;
*/

type HospitalEntryFields = {
  type: HospitalEntry["type"],
  description: unknown,
  date: unknown,
  specialist: unknown,
  diagnosisCodes: Array<unknown>,
  discharge: { date: unknown, criteria: unknown }
};

export const toNewHospitalEntry = ({ type, date, description, specialist, diagnosisCodes, discharge }: HospitalEntryFields) => {
  const newEntry = {
    type,
    date: parseEntryDate(date),
    description: parseDescription(description),
    specialist: parseSpecialist(specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
    discharge: parseDischarge(discharge),
  };
  return newEntry;
};

type OccupationalHealthcareEntryFields = {
  type: OccupationalHealthcareEntry["type"],
  description: unknown,
  date: unknown,
  specialist: unknown,
  diagnosisCodes: Array<unknown>,
  employerName: unknown,
  sickLeave: { startDate: unknown, endDate: unknown }
};

export const toNewOccupationalHealthcareEntry = ({ type, date, description, specialist, diagnosisCodes, employerName, sickLeave }: OccupationalHealthcareEntryFields) => {
  const newEntry = {
    type,
    date: parseEntryDate(date),
    description: parseDescription(description),
    specialist: parseSpecialist(specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
    employerName: parseEmployerName(employerName),
    sickLeave: parseSickLeave(sickLeave)
  };
  return newEntry;
};

type HealthCheckEntryFields = {
  type: HealthCheckEntry["type"],
  description: unknown,
  date: unknown,
  specialist: unknown,
  diagnosisCodes: Array<unknown>,
  healthCheckRating: unknown,
};

export const toNewHealthCheckEntry = ({ type, date, description, specialist, diagnosisCodes, healthCheckRating }: HealthCheckEntryFields) => {
  const newEntry = {
    type,
    date: parseEntryDate(date),
    description: parseDescription(description),
    specialist: parseSpecialist(specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
    healthCheckRating: parseHealthCheckRating(healthCheckRating)
  };
  return newEntry;
};