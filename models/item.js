const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
  material: {type: String, enum: ['mocha', 'leather', 'cotton']},
  brand: {type: String, enum: ['YSL', 'Gucci', 'Louis Vuitton']}
});

const Item = mongoose.model('items', itemSchema);
module.exports = Item;
