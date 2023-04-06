const morgan = require('morgan');
const express = require('express');
const compression = require('compression')
const logger = require('../src/log/log4js')
const session = require('express-session');
const MongoStore = require('connect-mongo');

const { config } = require('../src/config/enviroment')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

require('dotenv').config()


const baseProcces = () => {

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Process ${worker.process.pid} failure!`)
        cluster.fork()
    })

    const { Server: HTTPServer } = require('http');
    const { Server: IOServer } = require('socket.io');

    const infoRouter = require('./routes/api/infoRouter')
    const productsRouter = require("./routes/api/productRouter");
    const productsRouterTest = require("./routes/api/products-test");
    const cartRouter = require('../src/routes/api/cartRouter')
    const authWebRouter = require('../src/routes/web/auth')
    const homeWebRouter = require('../src/routes/web/home')

    const connectToDb = require("./config/connectToDb");

    const app = express();

    const httpServer = new HTTPServer(app);
    const io = new IOServer(httpServer);

    const dbController = require('./controllers/controllerMongoDB');
    const chatsController = require('./controllers/chatMongoDB');

    //Settings
    app.set('port', process.env.PORT || 8080)
    app.set('json spaces', 2)

    //Middlewares
    app.use(compression())
    app.use(morgan('dev'))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    //app.use(express.static(staticFiles))
    app.use(express.static('./public'))


    app.use(session({
        store: MongoStore.create({ mongoUrl: 'mongodb+srv://coderhouse:coderhouse123@cluster0.xvejx.gcp.mongodb.net/test' }),
        secret: '123456',
        resave: true,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            maxAge: 600000 //tiempo de sesion en ms (10min)
        }
    }))


    const PORT = 8080
    const server = httpServer.listen(PORT, () => {
        connectToDb("mongo")
        console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
    })
    server.on('error', error => logger.error(`Error en servidor ${error}`))

    
    //Routes
    app.use("/info", infoRouter)
    app.use("/api/productos", productsRouter)
    app.use("/api/carrito", cartRouter)
    app.use("/api/productos-test", productsRouterTest)

    //--- Ruta inexistente
    /*
    app.get('*', (req, res) => {
        logger.warn(`Ruta: ${req.url}, metodo: ${req.method} no existe`)
        res.send(`Ruta: ${req.url}, metodo: ${req.method} no existe`)
    })
    */

    //__ WebServ Routes __//
    app.use("/", authWebRouter)
    app.use("/", homeWebRouter)


    //websocket
    io.on('connection', async socket => {
        console.log('Nuevo cliente conectado!');

        // carga inicial de productos
        socket.emit('productos', await dbController.getProducts());

        // actualizacion de productos
        socket.on('update', async producto => {
            dbController.saveProduct(producto)
            io.sockets.emit('productos', await dbController.getProducts());
        })

        // carga inicial de mensajes
        socket.emit('mensajes', await chatsController.getAll());

        // actualizacion de mensajes
        socket.on('nuevoMensaje', async mensaje => {
            mensaje.date = new Date().toLocaleString()
            await chatsController.saveChat(mensaje)
            io.sockets.emit('mensajes', await chatsController.getAll());
        })
    });

}


if (config.mode != 'CLUSTER') {

    //-- Servidor FORK
    console.log('Server en modo FORK')
    console.log('-------------------')
    baseProcces()
} else {

    //-- Servidor CLUSTER   
    if (cluster.isPrimary) {
        console.log('Server en modo CLUSTER')
        console.log('----------------------')
        for (let i = 0; i < numCPUs; i++) { // creo tantos procesos como cpus tengo
            cluster.fork()
        }
    } else {
        baseProcces()
    }
}


