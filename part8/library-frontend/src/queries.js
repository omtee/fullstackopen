import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors  {
    name
    born
    id
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks  {
    title
    author { name }
    published
    genres
    id
  }
}
`

export const BOOKS_BY_GENRE = gql`
query allBooksByGenre($genreToSearch: String!) {
  allBooks(genre: $genreToSearch)  {
    title
    author { name }
    published
    id
  }
}
`

export const ADD_BOOK = gql`
mutation addBookMutation($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author { name }
    published
    genres
    id
  }
}
`

export const EDIT_AUTHOR = gql`
mutation editAuthorMutation($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
    id
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      username
      value
    }
  }
`

export const ME = gql`
  query getMe {
    me {
      username
      favoriteGenre
    }
  }
`