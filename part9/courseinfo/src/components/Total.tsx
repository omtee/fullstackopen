import React from 'react';
import { CoursePart } from '../types';

const Total = ({ courses }: { courses: CoursePart[] }) => {
  return (
    <div>
     <p>
        Number of exercises{" "}
        {courses.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  );
}

export default Total;