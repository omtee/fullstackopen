import React from 'react';

const Header = ({ course }) => (
  <h1>{course.name}</h1>
)

const Content = ({ course }) => (
  <p>
    {course.parts.map(part => <Part key={part.id} part={part} />)}
  </p>
)

const Part = ({ part }) => (
  <div>
    {part.name} {part.exercises}
  </div>
)

const Total = ({ course }) => {
  const total = course.parts.reduce((s, p) => s + p.exercises, 0)
  return (
    <p>Number of exercises {total}</p>
  )
}

export const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </div>
)