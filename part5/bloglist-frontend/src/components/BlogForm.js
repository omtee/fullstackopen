import React, { useState } from 'react'

const BlogForm = ({ handleAddBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    handleAddBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input type="text" id="title" value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
        </div>
        <div>
          author:
          <input type="text" id="author" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
        </div>
        <div>
          url:
          <input type="text" id="url" value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
        </div>
        <button type="submit" id="submit-blog-button">create</button>
      </form>
    </div>
  )
}

export default BlogForm