const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  { 
    id: 1,
    name: 'Arto Hellas', 
    number: '040-123456'
  },
  { 
    id: 2,
    name: 'Ada Lovelace', 
    number: '39-44-5323523'
  },
  { 
    id: 3,
    name: 'Dan Abramov', 
    number: '12-43-234345' 
  },
  { 
    id: 4,
    name: 'Mary Poppendieck', 
    number: '39-23-6423122' 
  }
]

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
  response.json(persons)
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

// POST: a new phonebook entry
app.post('/api/persons', (request, response) => {
  const body = request.body

  // error if data is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // error if person already exist
  if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

// DELETE: a single phonebook entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

// generates a random number betwen 1 and 1000000
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * 1000000)
    : 0
  return maxId + 1
}

/*
// func creates and returns a id higher than
// the current highest id
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}
*/

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})