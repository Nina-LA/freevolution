const mongoose = require('mongoose')
const User = require('../models/user')
const Invoice = require('../models/invoices')
const bcrypt         = require("bcryptjs");


const users_seeds = [
  {
    "lastName": "Fitzgerald",
    "firstName": "Wood",
    "email": "fitzgerald.wood@gmail.com",
    "username": "fwood",
    "password": bcrypt.hashSync("1234", bcrypt.genSaltSync(10))
  },
  {
    "lastName": "Combs",
    "firstName": "Concepcion",
    "email": "concepcion.combs@gmail.com",
    "username": "ccombs",
    "password": bcrypt.hashSync("2345", bcrypt.genSaltSync(10))
  },
  {
    "lastName": "Watkins",
    "firstName": "Margarita",
    "email": "margarita.watkins@gmail.com",
    "username": "mwatkins",
    "password": bcrypt.hashSync("3456", bcrypt.genSaltSync(10))
  },
  {
    "lastName": "Byers",
    "firstName": "Lilly",
    "email": "Lilly.Byers@gmail.com",
    "username": "lbyers",
    "password": bcrypt.hashSync("4567", bcrypt.genSaltSync(10))
  },
  {
    "lastName": "Mercer",
    "firstName": "Carmen",
    "email": "Carmen.Mercer@gmail.com",
    "username": "cmercer",
    "password": bcrypt.hashSync("5678", bcrypt.genSaltSync(10))
  }
]

const invoices_seeds = [
  {
    "prix": 15,
    "provider": "Mailchimp",
    "user": 0
  },
  {
    "prix": 35,
    "provider": "AWS",
    "user": 1
  },
  {
    "prix": 40,
    "provider": "Facebook_Ads",
    "user": 2
  },
  {
    "prix": 25,
    "provider": "Intercom",
    "user": 3
  },
  {
    "prix": 35,
    "provider": "Intercom",
    "user": 3
  }
]

mongoose
.connect('mongodb://localhost/freeproject', {useNewUrlParser: true})
.then(x => {
  console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  // Je suis connecté
  return User.remove()
}).then(x => {
  return Invoice.remove()
}).then(x => {
  return User.create(users_seeds)
})
.then(user => {
  invoices_seeds.forEach(m => {
    m.user= user[m.user]._id
  })
  return Invoice.create(invoices_seeds)
})
.then(invoices => {
  mongoose.connection.close()
})
.catch(err => {
  console.error('Error connecting to mongo', err)
  mongoose.connection.close()
});
