const { Router } = require('express');
const Cart = require("../../class/Product")
const dbController = require('../../controllers/controllerMongoDB')
const sendMessage = require('../../helpers/twilioMessage')
const sendEmail = require('../../helpers/nodeMailer')
const logger = require('../../log/log4js')

const cartRouter = Router();


cartRouter.get("/", async (req, res) => {
  const { method, url } = req;

  if (req.session.email) {
    const email = req.session.email;
    const user = await dbController.getUser(email)

    if (!user) {
      logger.error(`Ruta: ${url}, metodo: ${method}. No existe la cuenta`)
      res.status(403).json({ result: "error" });
      return;
    }

    res.json(user);
  } else {
    logger.error(`Ruta: ${url}, metodo: ${method}. Sesión no iniciada`)
    res.status(403).json({ result: "error" });
  }
});


cartRouter.get("/:id/productos", async (req, res) => {
  const { url, method } = req;

  if (req.session.email) {
    const { id } = req.params;

    const cart = await dbController.getCartById(id);

    if (!cart) {
      logger.error(`El método y la ruta son: ${method} ${url}. Carro no encontrado.`);
      res.status(404).json({ error: "Carro no encontrado." });
      return;
    }

    logger.info(`El método y la ruta son: ${method} ${url}.`);
    console.log(cart.productos);
    res.json(cart.productos);
    return;
  }

  logger.error(`Ruta: ${url}, metodo: ${method}. Sesión no iniciada`)

  res.redirect("/login");
});


cartRouter.post("/", async (req, res) => {
  const { url, method } = req;

  if (req.session.email) {
    const cartToAdd = new Cart();
    await dbController.saveCart(cartToAdd);

    logger.info(`El método y la ruta son: ${method} ${url}.`);
    res.json("Ok");
    return;
  }

  logger.error(`El método y la ruta son: ${method} ${url}.Sesión no iniciada.`);

  res.redirect("/login");
});


cartRouter.post("/:id/productos/:id_prod", async (req, res) => {
  const { url, method } = req;
  const id = req.query.id
  console.log(id)
  if (req.session.email) {
    const { id, id_prod } = req.params;

    const cart = await dbController.getCartById(id);
    const product = await dbController.getProductById(id_prod);

    if (!cart || !product) {
      logger.error(`El método y la ruta son: ${method} ${url}. Carrito o producto no encontrado.`);
      res.status(404).json({ error: "Carrito o producto no encontrado." });
      return;
    }

    await dbController.addProductInCart(id, id_prod);

    logger.info(`El método y la ruta son: ${method} ${url}.`);
    res.json(id);
    return;
  }

  logger.error( `El método y la ruta son: ${method} ${url}. Intento de acceso sin loggueo.`);
  res.redirect("/login");
});


cartRouter.delete("/:id", async (req, res) => {
  const { url, method } = req;
  if (req.session.email) {
    const { id } = req.params;

    const cart = await dbController.getCartById(id);

    if (!cart) {
      logger.error(`El método y la ruta son: ${method} ${url}. Carrito no encontrado.`);
      res.status(404).json({ error: "Carrito no encontrado." });
      return;
    }

    await dbController.deleteCart(id);

    logger.info(`El método y la ruta son: ${method} ${url}.`);
    res.json(id);
    return;
  }

  logger.error(`El método y la ruta son: ${method} ${url}. Intento de acceso sin loggueo.`);
  res.redirect("/login");
});


cartRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  const { url, method } = req;

  if (req.session.email) {
    const { id, id_prod } = req.params;
    const cart = await dbController.getCartById(id);
    const product = await dbController.getProductById(id_prod);

    if (!cart || !product) {
      logger.error(`El método y la ruta son: ${method} ${url}. Carrito o producto no encontrado.`);
      res.status(404).json({ error: "Carrito o producto no encontrado." });
      return;
    }

    const productToDelete = cart.productos.find((product) => product.id === id_prod);

    if (!productToDelete) {
      logger.error(`El método y la ruta son: ${method} ${url}. Producto no se encuentra dentro del carrito.`);
      res.status(404).json({ error: "Producto no se encuentra dentro del carrito." });
      return;
    }

    await dbController.deleteProductInCart(id, id_prod);
    logger.info(`El método y la ruta son: ${method} ${url}.`);

    res.json(id);
    return;
  }

  logger.error(`El método y la ruta son: ${method} ${url}. Intento de acceso sin loggueo.`);
  res.redirect("/login");
});


cartRouter.get("/confirm", async (req, res) => {
  const { url, method } = req;

  if (req.session.email) {
    const emailUser = req.session.email;

    const user = await dbController.getUser(emailUser);
    const cart = await dbController.getCartById(user.cartId);

    let messageToSend = `Productos:`;
    let html = `<h1>Productos:</h1>`;

    for (const productCart of cart.productos) {
      const product = await dbController.getProductById(productCart.id);

      messageToSend += `
      - nombre: ${product.title}, precio: ${product.price}`;

      html += `
      <h2>- nombre: ${product.title}, precio: ${product.price}</h2>`;
    }

     await sendMessage(user.phone, messageToSend);

     await sendMessage(
      process.env.WSP_NUMbER,
      messageToSend,
      true
    );

     await sendEmail(
      emailUser,
      messageToSend,
      `Nuevo pedido de ${user.username} - ${emailUser}`,
      html
    );

    res.send(messageToSend);
    return;
  }

  logger.error(
    `El método y la ruta son: ${method} ${url}. Intento de acceso sin loggueo.`
  );

  res.redirect("/login");
});


module.exports = cartRouter;
