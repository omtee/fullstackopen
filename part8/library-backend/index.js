require('dotenv').config()
const { createServer } = require('http')
const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { execute, subscribe } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const startApolloServer = async() => {
  const JWT_SECRET = process.env.SECRET
  const MONGODB_URI = process.env.MONGODB_URI
  const PORT = process.env.PORT
  const pubsub = new PubSub()
  const app = express()
  const httpServer = createServer(app)

  console.log('connecting to', MONGODB_URI)
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connection to MongoDB:', error.message)
    })

  const typeDefs = gql`
    type Author {
      name: String!
      born: Int
      id: ID!
      books: [Book!]!
      bookCount: Int
    }
    type Book {
      title: String!
      published: Int!
      author: Author!
      genres: [String!]!
      id: ID!
    }
    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }
    type Token {
      value: String!
    }
    type Subscription {
      bookAdded: Book! 
    }

    type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
    }

    type Mutation {
      addBook(
        title: String!
        published: Int!
        author: String!
        genres: [String!]!
      ): Book
      editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
    }
  `

  const resolvers = {
    Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        let filter = {}
        if (args.author) {
          filter = { ...filter, author: await Author.findOne({ name: args.author }) }
        }
        if (args.genre) {
          filter = { ...filter, genres: { $in: [ args.genre ] } }
        }
        return await Book.find(filter).populate('author')
      },
      allAuthors: () => Author.find({}),
      me: (root, args, context) => context.currentUser
    },
    Author: {
      bookCount: (root) => root.books.length
    },
    Mutation: {
      addBook: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }

        // Add author if not existing
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          try {
            author = new Author({ name: args.author, books: [] })
            await author.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }
        }

      const book = new Book({ ...args, author: author._id })

      try {
          await book.save()
          author.books = author.books.concat(book._id)
          await author.save()
          await book.populate('author').execPopulate()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return book
      },
      editAuthor: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        
        const author = await Author.findOne({ name: args.name })
        author.born = args.setBornTo

        try {
          return await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      },
      createUser: (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    
        return user.save()
          .catch(error => {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new UserInputError("wrong credentials")
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, JWT_SECRET) }
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      }
    }
  }

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          }
        }
      }
    ],
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    }
  })

  await server.start()
  server.applyMiddleware({
    app,
    path: '/'
  })  

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  )

  httpServer.listen(PORT, () => {
    console.log(`Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`)
  })
}

startApolloServer()