const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('data', function (request, respond) {
  return JSON.stringify(request.body)
})


app.use(morgan('tiny'))
app.use(morgan(':data'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })

})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(404).send({ error: 'malformatted id' })
    })
})



app.post('/api/persons', (request, response) => {
  console.log('444')
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: body.id
  })

  let onkoNimi = false

  function toimi() {
    let onkoNimi = false
    Person
      .find({})
      .then(result => {
        result.forEach(x => {
          if (x.name === body.name) {
            onkoNimi = true
            console.log(onkoNimi, 'haloo')
          }
        })

      })
      .catch(error => {
        console.log(error)
      })
    return onkoNimi
  }
  console.log(toimi(), 'mitähän vittua')

  if (toimi() === false) {
    person
      .save()
      .then(savedPerson => {
        response.json(Person.format(savedPerson))
      })
      .catch(error => {
        console.log(error)
      })

  } else {
    return response.status(400).json({ error: 'on jo siellä ' })
  }
})

app.put(`/api/persons/:id`, (request, response) => {

  const body = request.body
  const person = ({
    name: body.name,
    number: body.number,
  })

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(person => {
      response.json(Person.format(person))
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (req, res) => {
  let y = 0

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        y = y + 1
      })
      const date = new Date()
      res.send(`Puhelinluettelossa ${y} henkilön tiedot \n
            <p>${date}</p>`)

    })
    .catch(error => {
      console.log(error)
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})