const mongoose = require('mongoose')
if ( process.argv.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
  }
const password = process.argv[2]
const url =`mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })
.then(result => {
    console.log('Onnistui MongoDB')
  })
  .catch((error) => {
    console.log('Ei onnistunut MongoDB:', error.message)
  })
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3], number: process.argv[4]
    })
console.log(`Lisätty ${person.name}"`)
    person.save()
        .then(result => {
           mongoose.connection.close()
        })
} else {
    Person.find({})
        .then(result => {
            console.log('Puhelinluettelo:')
            result.forEach(person => {console.log(`Nimi: ${person.name} Numero: ${person.number}`)
            })
            mongoose.connection.close()    
        })
}