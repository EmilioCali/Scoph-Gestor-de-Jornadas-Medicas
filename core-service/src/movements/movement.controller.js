import { registrarEntrada } from "../inventory/inventory.service.js";
import { registrarSalidaReceta } from "../inventory/inventory.service.js";

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
};

//registrar salida por receta - de momento
export const createSalidaReceta = async (request, reply) => {
    try {
        const movimientos = await registrarSalidaReceta({
            detalle: request.body.detalle,
            destination: { type: "RECETA", id: null },
            metadata: {
                prescription: request.body.prescription,
                reason: request.body.reason
            },
            userId: request.user?.id || "system"
        });

        return reply.status(201).send({
            success: true,
            message: "Salida por receta registrada correctamente",
            data: movimientos
        })
    } catch (err) {
        return reply.status(400).send({
            success: false,
            message: "Error al intentar registrar la salida por receta",
            error: err.message
        });
        
    }
}