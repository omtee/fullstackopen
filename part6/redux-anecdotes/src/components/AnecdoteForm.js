import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {
  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
  }
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default connect(
  null,
  { createAnecdote }
)(AnecdoteForm)