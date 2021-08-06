import React from 'react'

const BlogForm = ({ newTitle, newAuthor, newUrl, setNewTitle, setNewAuthor, setNewUrl, handleNewBlog }) => (
  <div>
    <h2>Create new</h2>
    <form onSubmit={handleNewBlog}>
      <div>
        title:
        <input type="text" value={newTitle} name="Title" onChange={({ target }) => setNewTitle(target.value)} />
      </div>
      <div>
        author:
        <input type="text" value={newAuthor} name="Author" onChange={({ target }) => setNewAuthor(target.value)} />
      </div>
      <div>
        url:
        <input type="text" value={newUrl} name="Author" onChange={({ target }) => setNewUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  </div>
)

export default BlogForm