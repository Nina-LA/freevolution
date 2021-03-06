const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  AWSID: String,
  FacebookAdsID: String
})

const User = mongoose.model('User', UserSchema)

module.exports = User