const { normalize, denormalize, schema } = require('normalizr') 

const author = new schema.Entity("author", {}, { idAttribute: "email" });

const mensaje = new schema.Entity("mensaje", {
  author: author,
});

const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});

const normalizedData = (data) => {
  return normalize( data, mensajes)
}

const denormalizeData = (data) => {
  return denormalize(data.result, mensajes, data.entities);
}

module.exports = { normalizedData, denormalizeData }