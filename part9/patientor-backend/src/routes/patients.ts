import express from 'express';

import patientService from '../services/patientService';
import toNewPatient from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addEntry(newPatient);
    res.json(addedPatient);
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    }
  }
});

export default router;