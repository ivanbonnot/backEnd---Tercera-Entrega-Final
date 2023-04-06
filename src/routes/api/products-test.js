const { Router } = require("express")
const mock = require('../../controllers/fakermock')
const productsRouterTest = Router();

productsRouterTest.get('/', async (req, res) => {
    const productos = await mock.getAll();

    res.json(productos);
})


module.exports = productsRouterTest;

