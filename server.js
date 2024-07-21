const express = require('express');
const app = express();


// Middleware to parse JSON request bodies
app.use(express.json());

let persons = [
    { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    }
];

// GET persons list and timestamp added
app.get('/info', (req, res) => {
  const timestamp = new Date().toString();
  res.send(`<p>Phonebook has info for ${persons.length} people.<p/><p>Requested at ${timestamp}</p>`);
})

// GET all persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// GET /persons/:id - returns a single person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404)
        res.send('Person not found')
    }

})

// DELETE /persons/:id - make an HTTP DELETE request to the URL of the person
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 1000000000) +1);
}

// POST /persons - creates a new person and adds it to the persons array
app.post('/api/persons', (req, res) => {

    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Content missing. Please check your name and number'
        })
    }

    const existingPerson = persons.find(person => person.name === body.name)
    if(existingPerson) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons.concat(person)
    console.log('Created new person', person)
    res.json(person)

})

// The server is then started listening on port 3001.
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});