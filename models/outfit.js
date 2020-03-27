const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outfitSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  image: { type: String },
  occasion: { 
    type: String, 
    enum: [
      'Party', 
      'Work', 
      'Dinner', 
      'Funeral', 
      'Date', 
      'Workout',] 
  },
  description: {type: String},
  items: [{ 
    type: mongoose.Types.ObjectId, 
    ref: "items" 
  }],
  liked_by: [{ 
    type: mongoose.Types.ObjectId, 
    ref: "users" 
  }],
  shared: {type: Boolean},
  owner: { 
    type: mongoose.Types.ObjectId, 
    ref: "users" 
  }
});

const Outfit = mongoose.model('outfits', outfitSchema);
module.exports = Outfit;

