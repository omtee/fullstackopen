import express from 'express';

import patientService from '../services/patientService';
import { toNewPatient, toId, parseType, toNewHospitalEntry, toNewHealthCheckEntry, toNewOccupationalHealthcareEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  try {
    const id = toId(req.params.id);
    res.send(patientService.getPatient(id));
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    }
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    }
  }
});

router.post('/:id/entries', (req, res) => {
  const patientId = req.params.id;
  const entryType = parseType(req.body.type);
  req.body.type = entryType;
  
  try {
    switch (entryType) {
      case "HealthCheck":
        const newHealthCheckEntry = toNewHealthCheckEntry(req.body);
        const addedHealthCheckEntry = patientService.addEntry(patientId, newHealthCheckEntry);
        res.json(addedHealthCheckEntry);
        break;
      case "OccupationalHealthcare":
        const newOccupationalHealthcareEntry = toNewOccupationalHealthcareEntry(req.body);
        const addedOccupationalHealthcareEntry = patientService.addEntry(patientId, newOccupationalHealthcareEntry);
        res.json(addedOccupationalHealthcareEntry);
        break;
      case "Hospital":
        const newHospitalEntry = toNewHospitalEntry(req.body);
        const addedHospitalEntry = patientService.addEntry(patientId, newHospitalEntry);
        res.json(addedHospitalEntry);
        break;
      default:
        throw new Error(`no such entry found (${entryType})`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    }
  }
});

export default router;