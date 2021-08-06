const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) { response.status(401).json({ error: 'token missing or invalid' }) }

  const body = request.body

  if (!body.title || !body.author || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.notes = user.notes.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).exec()
  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user.id.toString()) {
      await blog.remove()
      response.status(204).end()
    } else {
      response.status(403).json({ error: 'access denied' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter