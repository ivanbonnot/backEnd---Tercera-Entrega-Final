const { Router } = require('express');
const infoRouter = Router();
const logger = require('../../log/log4js')

infoRouter.get('/', async ( req, res) => {

    const info = {
        cwd: `Directorio actual de trabajo: ${process.cwd()}`,
        pid: 'Id del proceso: '+ process.pid,
        version: 'Version de Node: ' + process.version,
        title: 'Titulo del proceso: ' + process.title,
        platform: 'Sistema operativo: ' + process.platform,
        memory: 'Uso de la memoria: ' + process.memoryUsage()
    }

    
    logger.info(`Ruta: /info, metodo: ${req.method}`)
    //console.log(info) 
    res.send(JSON.stringify(info))
})

module.exports = infoRouter