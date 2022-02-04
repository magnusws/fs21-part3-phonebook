const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to mongoDB')

mongoose.connect(url)
  .then(() => {
    console.log('connected to mongoDB')
  })
  .catch(err => {
    console.log('error connecting to mongoDB:', err.message)
  })

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters.'],
    required: [true, 'Name is required'],
    unique: [true, 'This name was already added to the phonebook!'],
  },
  number: {
    type: String,
    minLength: [8, 'Number must have a minimum length of 8'],
    validate: {
      validator: (v) => {
        return /\d{3}-\d/.test(v) || /\d{2}-\d/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)