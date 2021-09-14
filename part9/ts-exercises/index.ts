import express from 'express';

import { bmiCalculator } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!isNaN(height) && !isNaN(weight)) {
    const bmi = bmiCalculator(height, weight);
    res.send({ weight, height, bmi });
  } else {
    res.send({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.json({ error: 'parameters missing' });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const exerciseArray: Array<number> = daily_exercises.map((a: any) => Number(a));
    if (isNaN(Number(target)) || exerciseArray.some(isNaN)) {
      res.json({ error: 'malformatted parameters' });
    } else {
      const exerciseResult = exerciseCalculator(target, exerciseArray);
      res.json(exerciseResult);
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});