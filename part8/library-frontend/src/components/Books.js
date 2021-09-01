import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('')
  const books = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (books.loading)  {
    return <div>loading...</div>
  }

  // select book genres, flatten the array, create Set to remove duplicates, transforms to array
  const uniqueGenres = (books) => [...new Set(books.map(b => b.genres).flat())]

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.data.allBooks.filter(b => filter ? b.genres.includes(filter) : b).map(b =>
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {uniqueGenres(books.data.allBooks).map(g =>
          <button key={g} onClick={() => setFilter(g)}>{g}</button>
        )}
        <button onClick={() => setFilter('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books