import React, { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blod tests when dianosing patients'
  ]

  const count = anecdotes.length

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(count).fill(0))

  const GetRandomInt = (max) => Math.floor(Math.random() * max)
  const SelectRandom = () => setSelected(GetRandomInt(count))

  const AddPoint = (idx) => {
    const copy = [...points]
    copy[idx] += 1
    setPoints(copy)
  }

  const MostVotes = () => {
    return points.indexOf(Math.max(...points));
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <p>
        <Button handleClick={() => AddPoint(selected)} text="vote" />
        <Button handleClick={() => SelectRandom()} text="next anecdote" />
      </p>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[MostVotes()]}</p>
    </div>
    
  )
}

export default App