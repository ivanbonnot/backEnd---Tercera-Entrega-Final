const mongoose = require('mongoose') 
const { Schema, model } = mongoose


const productoSchema = new Schema({
  timestamp: { type: Number, require: true },
  title: { type: String },
  thumbnail: { type: String },
  description: { type: String },
  stock: { type: Number },
  code: { type: String },
  price: { type: Number }
});

const productModel = model('Productos', productoSchema)

module.exports = productModel
