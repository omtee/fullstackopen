import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author { name born bookCount id }
    published
    genres
    id
  }
`

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born
    id
    bookCount
  }
`

export const ALL_AUTHORS = gql`
  query getAllAuthors {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
  query getAllBooks($genreToSearch: String) {
    allBooks(genre: $genreToSearch) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      ...BookDetails
    }
    ${BOOK_DETAILS}
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
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