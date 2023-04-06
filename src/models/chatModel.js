const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const chatSchema = new Schema({
  author: {
    email: { type: String, require: true },
    name: { type: String, require: true },
    lastname: { type: String, require: true },
    age: { type: Number, require: true },
    nickname: { type: String, require: true },
    avatar: { type: String, require: true },
  },
  text: { type: String, require: true },
  date: { type: Date, require: true },
});


const chatModel = model("Chat", chatSchema);

module.exports = chatModel;

