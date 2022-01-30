require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Middlewares
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// Morgan:
// Defines a token for logging data in POST requests.
morgan.token('data', (req) => { 
  return req.method === 'POST'
  ? JSON.stringify(req.body) 
  : null 
})

// Custom log format ('tiny' format including 'data' token at the end).
morgan.format(
  'tiny', 
  ':method :url :status :res[content-length] - :response-time ms :data'
)

// App use morgan with modified 'tiny' format.
app.use(morgan('tiny'))

// ---------------------------------------------------------------------

//GET: info page
app.get('/info', (request, response) => {
  const numOfPersons = persons.length
  const currentTimeDate = new Date()
  response.send(`
  <p>Phonebook has info for ${numOfPersons} people</p>
  <p>${currentTimeDate}</p>
  `)
})

// GET: all phonebook entries
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

// GET: information for a single phonebook entry
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if(person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// DELETE: a single phonebook entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

// POST: a new phonebook entry
app.post('/api/persons', (request, response) => {
  const body = request.body

  // return error if data is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })

  /*
  // return error if person already exist
  if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  */
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})