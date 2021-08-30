const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  published: {
    type: Number,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  },
  genres: {
    type: [String],
    validate: v => Array.isArray(v) && v.length > 0
  }
})

schema.plugin(uniqueValidator)
module.exports = mongoose.model('Book', schema)