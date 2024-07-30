require('dotenv').config();
const Person = require('./models/person');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');


// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

// Middleware to enable CORS for all routes
app.use(cors());

// Middleware to log requests using Morgan
morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Define middleware for error handling
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if(error.name === 'CastError') {
        return res.status(400).send({error: 'Invalid ID format'})
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }
    next(error)
}

// Define middleware for unknown API endopoints error handling 
const unknownEndpoint = (req, res, next) => {
    res.status(404).send({ error: 'Unknown endpoint' });
}

// GET persons list and timestamp added
app.get('/info', (req, res) => {
  const timestamp = new Date().toString();
  res.send(`<p>Phonebook has info for ${persons.length} people.<p/><p>Requested at ${timestamp}</p>`);
});

// GET all persons
app.get('/api/persons', (req, res) => {
    Person.find({})
     .then(persons => {
        res.json(persons);
      })
});

// GET /persons/:id - returns a single person by ID
app.get('/api/persons/:id', (req, res) => {

    Person.findById(req.params.id)
    .then(person => {
        if(person) {
            res.json(person);
        } else {
            res.status(404).send('Person not found');
        }
    })
    .catch(error => next(error))
});

// DELETE /persons/:id - make an HTTP DELETE request to the URL of the person
app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
});

// PUT /persons/:id - update an existing person by ID
app.put('/api/persons/:id/', (req, res, next) => {
    const {name, number} = req.body

    Person.findByIdAndUpdate(req.params.id, {name, number}, {new : true, runValidators: true, context:'query'})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// POST /persons - creates a new person and adds it to the persons array
app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
    .then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))

});

app.use(unknownEndpoint)
app.use(errorHandler)

// Define the port the server will listen on, defaulting to 3001 if not specified in environment variables
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});