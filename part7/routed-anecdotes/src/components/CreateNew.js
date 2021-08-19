import React from 'react'
import { useField } from '../hooks'

const CreateNew = (props) => {
  let content = useField('text')
  let author = useField('text')
  let info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  const useResetForm = () => {
    const emptyEvent = { target: { value: '' }}
    content.onChange(emptyEvent)
    author.onChange(emptyEvent)
    info.onChange(emptyEvent)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button type="button" onClick={useResetForm}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew