import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Number = ({ person }) => (
  <p>{person.name} {person.number}</p>
)

const Filter = ({ filter, handler }) => (
  <div>
    filter shown with
    <input value={filter} onChange={handler} />
  </div>
)

const PersonForm = (props) => {
  const { submitHandler } = props
  const { nameValue, nameHandler } = props
  const { numberValue, numberHandler } = props

  return (
    <form onSubmit={submitHandler}>
      <div>
        name: <input value={nameValue} onChange={nameHandler} />
      </div>
      <div>
        number: <input value={numberValue} onChange={numberHandler} />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

const Persons = ({ persons }) => (
  <div>
    {persons.map(person => <Number key={person.name} person={person} />)}
  </div>
)

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      const alert_message = `${newName} is already added to phonebook`
      window.alert(alert_message)
      return false
    }

    const PersonObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }

    setPersons(persons.concat(PersonObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handler={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        submitHandler={addPerson}
        nameValue={newName}
        nameHandler={handleNameChange}
        numberValue={newNumber}
        numberHandler={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App