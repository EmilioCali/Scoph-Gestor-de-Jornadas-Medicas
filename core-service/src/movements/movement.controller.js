import { registrarEntrada } from "../inventory/inventory.service.js";
import { registrarSalidaReceta, registrarTransferencia } from "../inventory/inventory.service.js";
import { handleServiceError } from '../utils/errorHandler.js';

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
        return handleServiceError(error, reply);
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
    } catch (error) {
        return handleServiceError(error, reply);
    }
}

export const createTransferencia = async (request, reply) => {
    try {
        const { jornadaId, jornadaNombre, detalle } = request.body;

        const movimiento = await registrarTransferencia({
        jornadaId,
        jornadaNombre,
        detalle,
        userId: request.user?.id || 'system'
        });
        
        return reply.status(201).send({
        success: true,
        message: 'Transferencia a jornada registrada exitosamente',
        data: movimiento
        });
    } catch (error) {
        return handleServiceError(error, reply);
    }
};