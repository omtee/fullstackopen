import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_DIAGNOSES_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "SET_PATIENT_INFO";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_ENTRY";
      payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_DIAGNOSES_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "SET_PATIENT_INFO":
      return {
        ...state,
        patientInfo: {
          ...state.patientInfo,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patientInfo: {
          ...state.patientInfo,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (patientListFromApi: Patient[]) => {
  const action: Action = {
    type: 'SET_PATIENT_LIST',
    payload: patientListFromApi
  };
  return action;
};

export const setDiagnosesList = (diagnosesListFromApi: Diagnosis[]) => {
  const action: Action = {
    type: 'SET_DIAGNOSES_LIST',
    payload: diagnosesListFromApi
  };
  return action;
};

export const setPatientInfo = (patientInformationFromApi: Patient) => {
  const action: Action = {
    type: 'SET_PATIENT_INFO',
    payload: patientInformationFromApi
  };
  return action;
};

export const addPatient = (newPatient: Patient) => {
  const action: Action = {
    type: 'ADD_PATIENT',
    payload: newPatient
  };
  return action;
};

export const addEntry = (updatedPatient: Patient) => {
  const action: Action = {
    type: 'ADD_ENTRY',
    payload: updatedPatient
  };
  return action;
};