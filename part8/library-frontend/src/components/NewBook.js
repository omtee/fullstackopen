import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ME } from '../queries'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
    update: (cache, response) => {
      updateCacheWith(cache, response.data.addBook)
    }
  })

  const updateCacheWith = (cache, addedBook) => {
    const includedIn = (set, object) => set.map(o => o.id).includes(object.id)

    const authorsInCache = cache.readQuery({ query: ALL_AUTHORS })
    if (!includedIn(authorsInCache.allAuthors, addedBook.author)) {
      cache.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors : authorsInCache.allAuthors.concat(addedBook.author) }
      })
    }

    const booksInCache = cache.readQuery({ query: ALL_BOOKS })
    if (!includedIn(booksInCache.allBooks, addedBook)) {
      cache.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : booksInCache.allBooks.concat(addedBook) }
      })
    }

    const meInCache = cache.readQuery({ query: ME })

    if (addedBook.genres.includes(meInCache.me.favoriteGenre)) {
      const recommendedBooksQuery = {
        query: ALL_BOOKS,
        variables: { genreToSearch: meInCache.me.favoriteGenre }
      }

      const recommendedBooksInCache = cache.readQuery(recommendedBooksQuery)
      if (!includedIn(recommendedBooksInCache.allBooks, addedBook)) {
        cache.writeQuery({
          ...recommendedBooksQuery,
          data: { allBooks : recommendedBooksInCache.allBooks.concat(addedBook) }
        })
      }
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    
    addBook({
      variables: {
        title, author, published: parseInt(published), genres
       }
    })
    
    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  if (!show) {
    return null
  }
  return (
    <div>
      <h2>add new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook