const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to mongoDB')

mongoose.connect(url)
  .then(result => {
    console.log('connected to mongoDB')
  })
  .catch(err => {
    console.log('error connecting to mongoDB:', err.message)
  })

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)