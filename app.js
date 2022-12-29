import express from 'express'
import http from 'http'
import routers from './routes/index.js'

import { errorHandler } from './utils/errorHandler.js'
import validarRecurso  from './middlewares/validar-ruta.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', routers)
app.use(errorHandler)
app.use(validarRecurso)

const PORT = process.env.NODE_PORT || 3000
const ENV = process.env.NODE_ENV

const server = app.listen(PORT, () => {
    console.log(
      `Servidor http esta escuchando en el puerto ${server.address().port}`
    );
    console.log(`http://localhost:${server.address().port}`);
    console.log(`Environment:${ENV}`);
  });
  
  server.on("error", (error) => console.log(`Error en servidor ${error}`));