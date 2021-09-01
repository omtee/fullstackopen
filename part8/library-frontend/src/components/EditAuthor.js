import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const EditAuthor = (props) => {
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')

  const authors = useQuery(ALL_AUTHORS)
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, { refetchQueries: [ ALL_AUTHORS ]})
  
  if (!props.show) {
    return null
  }

  if (authors.loading)  {
    return <div>loading...</div>
  } else if (!author) { // init states to be the first author
    setAuthor(authors.data.allAuthors[0].name)
  }
  
  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: author, setBornTo: parseInt(born) }})
    setAuthor('')
    setBorn('')
  }

  return (
    <div>
      <h2>edit author</h2>
      <form onSubmit={submit}>
        <select name="author" onChange={({ target }) => setAuthor(target.value)}>
          {authors.data.allAuthors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
        <div>
          born
          <input value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default EditAuthor