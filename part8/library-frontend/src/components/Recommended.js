import React, { useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'

import { ALL_BOOKS, ME } from '../queries'

const Recommended = (props) => {
  const me = useQuery(ME)
  const [getBooks, books] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    if (me.data && me.data.me) {
      getBooks({ variables: { genreToSearch: me.data.me.favoriteGenre }})
    }
  }, [props.show, me, getBooks])

  if (!props.show) {
    return null
  }

  if (books.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{me.data.me.favoriteGenre}</b></p>
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
          {books.data.allBooks.map(b =>
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended