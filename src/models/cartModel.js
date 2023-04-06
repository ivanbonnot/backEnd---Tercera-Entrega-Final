const mongoose = require('mongoose')
const { Schema, model } = mongoose

const cartSchema = new Schema({
  timestamp: { type: Number, require: true },
  productos: { type: Array, required: true }
})


const cartModel = model('Cart', cartSchema)


module.exports = cartModel