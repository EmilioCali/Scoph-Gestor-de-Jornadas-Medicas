import { createEntrada, createSalidaReceta, createTransferencia } from './movement.controller.js'

const movementRoutes = async (fastify) => {
    fastify.post('/movimientos/entrada', createEntrada) //manejar mov
    fastify.post('/movimientos/salida-receta', createSalidaReceta)// manejar salida receta
    fastify.post('/movimientos/transferencia', createTransferencia)
}

export default movementRoutes
