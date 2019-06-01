const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String, number: String
})

module.exports = Person