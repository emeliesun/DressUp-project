const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { 
    type: String, 
    required: true,
    },
  lastname: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true, 
    unique: true 
  },
  friend_request: {
    type: Array, 
    default: []
  },
  friends: { 
    type: Array, 
    default: []
  },
  image: { type: String },
  new_reqs: { 
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('users', userSchema);
module.exports = User;
