import React, { useState } from 'react'

const Blog = ({ blog, username, handleUpdateBlog, handleDeleteBlog }) => {
  const [showInfo, setShowInfo] = useState(false)

  const showWhenVisible = { display: showInfo ? '' : 'none' }

  const toggleVisibility = () => {
    setShowInfo(!showInfo)
  }

  const addLike = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    handleUpdateBlog(blog.id, blogObject)
  }

  const deleteBlog = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      handleDeleteBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div id={blog.id}>
        {blog.title} {blog.author}
        <button className="toggle-info-button" onClick={toggleVisibility}>{showInfo ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          <span className="likes">{blog.likes}</span>
          <button className="like-button" onClick={addLike}>like</button>
        </p>
        <p>{blog.user.name}</p>
        {blog.user.username === username ? <button className="remove-button" onClick={deleteBlog}>remove</button> : ''}
      </div>
    </div>
  )
}

export default Blog