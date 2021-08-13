import React, { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import blogService from './services/blogs'
import Togglable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (loginInfo) => {
    try {
      const user = await loginService.login(loginInfo)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      sendNotification('Wrong username or password')
    }
  }

  const handleLogout = () => {
    sendNotification('Logged out')
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    setUser(null)
  }

  const handleAddBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      sendNotification(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    } catch (exception) {
      sendNotification('error adding blog')
      console.log('blog add error', exception)
    }
  }

  const handleUpdateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      //sendNotification(`updated blog "${returnedBlog.title}" by ${returnedBlog.author}`)
    } catch (exception) {
      sendNotification('error updating blog')
      console.log('blog update error', exception)
    }
  }

  const handleDeleteBlog = async (id) => {
    const toDelete = blogs.find(blog => blog.id === id)
    try {
      console.log('trying to delete', id)
      const response = await blogService.remove(id)
      console.log('delete response', response)
      setBlogs(blogs.filter(blog => blog.id !== id))
      sendNotification(`blog "${toDelete.title}" by ${toDelete.author} deleted`)
    } catch (exception) {
      sendNotification('error deleting blog, blog already deleted?')
      console.log('blog delete error', exception)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const sendNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const loginComponent = () => (
    <LoginForm handleLogin={handleLogin} />
  )

  const blogFormRef = useRef()

  const blogFormComponent = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm handleAddBlog={handleAddBlog} />
    </Togglable>
  )

  const blogsComponent = () => (
    <div className="blog-list">
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => <Blog key={blog.id} blog={blog} username={user.username}
          handleUpdateBlog={handleUpdateBlog} handleDeleteBlog={handleDeleteBlog} />)
      }
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      {user === null ?
        loginComponent() :
        <div>
          <p>
            {user.name} logged-in
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          {blogFormComponent()}
          {blogsComponent()}
        </div>
      }
    </div>
  )
}

export default App