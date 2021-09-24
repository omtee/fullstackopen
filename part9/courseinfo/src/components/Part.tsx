import React from 'react';
import { CoursePart } from '../types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ course }: {  course: CoursePart }) => {
  switch (course.type) {
    case "normal":
      return (
        <div>
          <b>{course.name} {course.exerciseCount}</b>
          <p>{course.description}</p>
        </div>
      );
    case "groupProject":
      return (
        <div>
          <b>{course.name} {course.exerciseCount}</b>
          <p>project exercises {course.groupProjectCount}</p>
        </div>
      );
    case "submission":
      return (
        <div>
          <b>{course.name} {course.exerciseCount}</b>
          <p>{course.description}</p>
          <p>submit to {course.exerciseSubmissionLink}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <b>{course.name} {course.exerciseCount}</b>
          <p>{course.description}</p>
          <p>required skills: {course.requirements.join(', ')}</p>
        </div>
      );
    default:
      return assertNever(course);
  }
}

export default Part;