import React from 'react';
import { CoursePart } from '../types';
import Part from './Part';

const Content = ({ courses }: {  courses: CoursePart[] }) => {
  return (
    <div>
     {courses.map((course) => <Part key={course.name} course={course} />)}
    </div>
  );
}

export default Content;