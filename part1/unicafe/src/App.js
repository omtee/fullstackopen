import React, { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistic = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad}) => {
  const count = good + neutral + bad

 if (count === 0) {
   return (
    <div>No feedback given</div>
   )
  }

  const average = (good * 1 + neutral * 0 + bad * -1) / count
  const positive = good / count * 100

  return (
    <table>
      <tbody>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={count} />
        <Statistic text="average" value={average.toFixed(1)} />
        <Statistic text="positive" value={positive.toFixed(1) + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const IncreaseGood = () => setGood(good + 1)
  const IncreaseNeutral = () => setNeutral(neutral + 1)
  const IncreaseBad = () => setBad(bad + 1)

  return (
    <div>
       <h1>give feedback</h1>
      <Button handleClick={() => IncreaseGood()} text="good" />
      <Button handleClick={() => IncreaseNeutral()} text="neutral" />
      <Button handleClick={() => IncreaseBad()} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App