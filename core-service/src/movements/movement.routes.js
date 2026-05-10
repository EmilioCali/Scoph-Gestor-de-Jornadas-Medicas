import { createEntrada } from './movement.controller.js'

const movementRoutes = async (fastify) => {
    fastify.post('/movimientos/entrada', createEntrada)
}

export default movementRoutes
