import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Number = ({ person, deletePerson }) => (
  <p>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id)}>delete</button>
  </p>
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

const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person => <Number key={person.name} person={person} deletePerson={deletePerson} />)}
  </div>
)

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState('some error happened...')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.filter(person => person.name === newName)[0]
    if (existingPerson) {
      const confirm_message = `${newName} is already added to phonebook, replace the old number with a new one?`
      if (window.confirm(confirm_message)) {
        const changedPerson = { ...existingPerson, number: newNumber}
        updatePerson(changedPerson)
      } else {
        return false
      }
    } else {
      const PersonObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(PersonObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setErrorMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const updatePerson = (changedPerson) => {
    personService
      .update(changedPerson.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.name !== returnedPerson.name ? person : returnedPerson))
        setErrorMessage(`Updated number for ${returnedPerson.name}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage(
          `Information of '${changedPerson.name}' has already been removed from server` 
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(person => person.name !== changedPerson.name))
      })
  }

  const deletePerson = (id) => {
    const confirm_message = `Delete ${persons.filter(person => person.id === id)[0].name}?`
    if (window.confirm(confirm_message)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    } else {
      return false
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
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
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App