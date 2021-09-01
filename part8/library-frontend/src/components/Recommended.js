import React, { useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE, ME } from '../queries'

const Recommended = (props) => {
  const currentUser = useQuery(ME)
  const [getBooks, result] = useLazyQuery(BOOKS_BY_GENRE)

  useEffect(() => {
    if (currentUser.data) {
      getBooks({ variables: { genreToSearch: currentUser.data.me.favoriteGenre }})
    }
  }, [props.show, currentUser, getBooks])

  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{currentUser.data.me.favoriteGenre}</b></p>
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
          {result.data.allBooks.map(b =>
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