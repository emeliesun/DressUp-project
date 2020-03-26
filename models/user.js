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
  outfits: [{
    type: mongoose.Types.ObjectId, 
    ref: "outfits"
  }],
  friend_request: [{
    type: mongoose.Types.ObjectId, 
    ref: "users"
  }],
  friends: [{
    type: mongoose.Types.ObjectId, 
    ref: "users"
  }],
  image: { type: String },
  new_reqs: { 
    type: Boolean,
    default: false
  },
  items: { 
    type: mongoose.Types.ObjectId, 
    ref: "items" 
  }
});

const User = mongoose.model('users', userSchema);
module.exports = User;
