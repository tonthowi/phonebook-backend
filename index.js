const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

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

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

// Middleware to enable CORS for all routes
app.use(cors());

// Middleware to log requests using Morgan
morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// GET persons list and timestamp added
app.get('/info', (req, res) => {
  const timestamp = new Date().toString();
  res.send(`<p>Phonebook has info for ${persons.length} people.<p/><p>Requested at ${timestamp}</p>`);
});

// GET all persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// GET /persons/:id - returns a single person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);

    if(person) {
        res.json(person);
    } else {
        res.status(404).send('Person not found');
    }
});

// DELETE /persons/:id - make an HTTP DELETE request to the URL of the person
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

const generateId = () => {
    return String(Math.floor(Math.random() * 1000000000) + 1);
};

// POST /persons - creates a new person and adds it to the persons array
app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Content missing. Please check your name and number'
        });
    }

    const existingPerson = persons.find(person => person.name === body.name);
    if(existingPerson) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);  // Reassign the persons array

    res.json(person);
});

// Define the port the server will listen on, defaulting to 3001 if not specified in environment variables
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});