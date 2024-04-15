const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userschema = new Schema({
  username_login: {
    type: String,
    require: true,
    unique: true,
  },
  email_login: {
    type: String,
    require: true,
    unique: true,
  },
  password_login: {
    type: String,
    require: true, 
  },
});

module.exports = mongoose.model("login", userschema);
