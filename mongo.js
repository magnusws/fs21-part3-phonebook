const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = 
  `mongodb+srv://magnusws:${password}@cluster0.1ktzx.mongodb.net/phonebook-app?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema ({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// Get every single person obj from db and print to console
if (process.argv.length === 3) {
  mongoose.connect(url)

  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

// Add data for a new person to db
if (process.argv.length > 3) {
  mongoose.connect(url)

  const person = new Person ({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}