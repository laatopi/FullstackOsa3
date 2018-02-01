const mongoose = require('mongoose')

const url = 'mongodb://fullstack:sekred@ds121118.mlab.com:21118/fullstack'

mongoose.connect(url)
mongoose.Promise = global.Promise;


const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const person = new Person({
    name: '',
    number: ''
})

const Array = process.argv

if (Array[2] === undefined) {
    console.log('puhelinluettelo:')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
} else {
    person.name = Array[2]
    person.number = Array[3]
    person
        .save()
        .then(response => [
            mongoose.connection.close()
        ])

}




