interface ExerciseResults {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  value1: number;
  value2: Array<number>;
}

const parseExerciseArguments = (args: Array<string>): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const exerciseArray = args.slice(3).map(a => Number(a));

  if (!isNaN(Number(args[2])) && !exerciseArray.some(isNaN)) {
    return {
      value1: Number(args[2]),
      value2: exerciseArray
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateExercises = (target: number, exercises: Array<number>): ExerciseResults => {
  const periodLength = exercises.length;
  const trainingDays = exercises.filter(e => e).length;
  const average = exercises.reduce((sum, a) => sum + a) / exercises.length;
  const success = average >= target;
  
  const getRating = (target: number, average: number) => {
    if (average >= target) {
      return 3;
    } else if (average > target - 0.5) {
      return 2;
    } else {
      return 1;
    }
  };

  const rating = getRating(target, average);

  const getRatingDescription = (rating: number): string => {
    switch(rating) {
      case 3:
        return 'you have achieved your target';
      case 2:
        return 'not too bad but could be better';
      case 1:
        return 'could be a lot better';
      default:
        throw new Error('Something went wrong, no such rating!');
    }
  };

  const ratingDescription = getRatingDescription(rating);

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const { value1, value2 } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(value1, value2));
} catch (e) {
  console.log('Error, something bad happened, message:', (<Error>e).message);
}

export { calculateExercises as exerciseCalculator };
