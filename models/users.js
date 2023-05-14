const mongoose = require('mongoose');

const userSchema =mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  strict:false,
  versionKey:false
});

const User= mongoose.model('users', userSchema);
module.exports =User