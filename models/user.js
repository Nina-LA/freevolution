const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  lastName: String,
  firstName: String,
  email: String,
  username: String,
  password: String
})

const User = mongoose.model('User', UserSchema)

module.exports = User