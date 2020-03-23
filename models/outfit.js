const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outfitSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
  occasion: { type: String, enum: ['Party', 'Work', 'Dinner'] },
  description: {type: String},
  items: [{ type: mongoose.Types.ObjectId, ref: "items" }],
  liked_by: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  shared: {type: Boolean},
});

const Outfit = mongoose.model('outfits', outfitSchema);
module.exports = Outfit;

