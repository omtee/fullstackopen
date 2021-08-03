const Blog = require('../models/blog')

const initialBlogs = [
  { 'title':'My book','author':'Olli Tee','url':'mybook.com','likes':15,'id':'6101b3300d668125b489e44a' },
  { 'title':'My blog','author':'Olli Teevee','url':'mybook.com','likes':115,'id':'61099bc7d768d648cc3ce2a2' }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'dadalicious', url: 'www.com', likes: 1 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}