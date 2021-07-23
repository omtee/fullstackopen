import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handler }) => (
  <div>
    find countries <input value={filter} onChange={handler} />
  </div>
)

const Results = ({ countries, handlerSelect }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countries.length > 1) {
    return <CountryList countries={countries} handler={handlerSelect}/>
  }
  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />
  }
  else {
    return <div>No match</div>
  }
}

const CountryList = ({ countries, handler }) => {
  return (
    <div>
      {countries.map(country => (
        <p key={country.name}>
          {country.name}
          <button onClick={() => handler(country.name)}>show</button>
        </p>
      ))}
    </div>
  )
}

const CountryInfo = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img alt={country.name} src={country.flag} height="75px"></img>
    </div>
  )
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => setFilter(event.target.value.toLowerCase())
  const handleSelectCountry = (country) => setFilter(country.toLowerCase())

  const countriesFiltered = countries.filter(country => country.name.toLowerCase().includes(filter))

  return (
    <div>
      <Filter filter={filter} handler={handleFilterChange} />
      <Results countries={countriesFiltered} handlerSelect={handleSelectCountry} />
    </div>
  )
}

export default App