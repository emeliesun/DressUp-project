const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outfitSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
  occasion: { type: String, enum: ['Party', 'Work', 'Dinner'] },
  items: { type: Array, default: [] },
  liked_by: { type: Array, default: [] },
  shared: {type: Boolean},
});

const Outfit = mongoose.model('outfits', outfitSchema);
module.exports = Outfit;
