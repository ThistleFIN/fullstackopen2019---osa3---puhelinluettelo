const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./src/models/person')

const createPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person.id
    }
}

morgan.token('type', (request, response) => {
    return JSON.stringify(request.body)})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :response[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) =>{
    response.send(`<p>Testi</p>`)
})

app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            response.send(`<p>Puhelinluettelossa on ${persons.length} henkilöä</p>
                      <p>${Date(Date.now)}</p>`)
        })
        .catch(error => {console.log(error)})
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {response.json(persons.map(createPerson))})
        .catch(error => {console.log(error)})
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person){
                response.json(createPerson(person))
            }else{
                response.status(204).end()
            }
        })
        .catch(error => {next(error)
            response.status(204).send({ error: 'Id:ssä on jotain vikaa' })
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {response.json(createPerson(updatedPerson))
        })
        .catch(error => {next(error)
            response.status(204).send({ error: 'Id:ssä on jotain vikaa' })
        })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (body===undefined){
        return response.status(400).json({ error: 'Body puuttuu' })
    }
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedPerson => {
            response.json(createPerson(savedPerson))
        })
        .catch(error => {next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {response.status(204).end()
        })
        .catch(error => {next(error)
            response.status(204).send({ error: 'Id:ssä on jotain vikaa' })
        })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})