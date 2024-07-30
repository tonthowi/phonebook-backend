const mongoose = require('mongoose')

// if(process.argv.length < 3) {
//     console.log('Please provide the password as argument')
//     process.exit(1)
// }


if(process.argv.length === 3) {
    Person
   .find({})
   .then(result => {
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
   })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        // name:"John Cena",
        // number:"040-233434"
    })

    person.save().then((result) => {
        console.log(`Added ${person.name} number ${person.number} to the phonebook database`)
        mongoose.connection.close()
    })
}
