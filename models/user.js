const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
<<<<<<< HEAD
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
=======
  lastName: String,
  firstName: String,
  email: String,
  username: String,
  password: String,
  AWSID: String,
  FacebookAdsID: String
>>>>>>> 515a00f347a8a3fe47d031d5815726f4218d926c
})

const User = mongoose.model('User', UserSchema)

module.exports = User