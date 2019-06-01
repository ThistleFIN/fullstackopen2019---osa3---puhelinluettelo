var uniqueValidator = require('mongoose-unique-validator')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
const url = process.env.MONGODB_URI

console.log(`Yritetään liittyä ${url}`)

if(process.env.NODE_ENV === 'production'){
    mongoose.connect(url).then(console.log('Liittyminen onnistui MongoDb'))
        .catch(error => console.log(error))
}else{
    mongoose.connect(url, { useNewUrlParser: true }).then(console.log('Liittyminen onnistui MongoDb'))
        .catch(error => console.log(error))
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        unique: true,
    },
    phone: {
        type: String,
        minlength: 6,
    }
})
personSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })
personSchema.set('toJSON', {
    transform: (document, returned) => {
        returned.id = returned._id.toString()
        delete returned._id
        delete returned.__v
    }
})

module.exports = mongoose.model('Person', personSchema)