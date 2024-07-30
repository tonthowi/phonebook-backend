const mongoose = require('mongoose')
const password = process.argv[2]

const url = process.env.MONGODB_URI
console.log('Connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
.then(result => {
    console.log('Connected to MongoDB')
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength:8,
        required: true,
        match: [/^\d{2,3}-\d+$/, 'Please enter a valid phone number in the format XX-XXXXXXX or XXX-XXXXXXXX']
    }
})

personSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)