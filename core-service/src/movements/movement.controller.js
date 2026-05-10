import { registrarEntrada } from "../inventory/inventory.service.js";

export const createEntrada = async (request, reply) => {
    try {
        const movimientos = await registrarEntrada({
            tipoEntrada: request.body.tipoEntrada,
            detalle: request.body.detalle,
            destination: request.body.destination,
            userId: request.user?.id || 'system'
        })

        return reply.status(201).send({
            success: true,
            message: 'Movimiento de entrada registrado exitosamente',
            data: movimientos
        })
    } catch (error) {
        return reply.status(400).send({
            success: false,
            message: 'Error al registrar el movimiento',
            error: error.message
        })
    }
}