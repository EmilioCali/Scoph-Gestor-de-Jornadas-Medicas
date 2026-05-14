import { registrarEntrada } from "../inventory/inventory.service.js";
import { registrarSalidaReceta, registrarTransferencia } from "../inventory/inventory.service.js";
import { handleServiceError } from '../utils/errorHandler.js';
import { successResponse } from '../utils/response.js';
import { descontarStockJornada } from "../inventory/inventory.service.js";

export const createEntrada = async (request, reply) => {
    try {
        const movimientos = await registrarEntrada({
            tipoEntrada: request.body.tipoEntrada,
            detalle: request.body.detalle,
            destination: request.body.destination,
            userId: request.user?.id || 'system'
        })

        return successResponse(reply, {
            message: 'Movimiento de entrada registrado exitosamente',
            data: movimientos,
            statusCode: 201
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

        return successResponse(reply, {
            message: 'Salida por receta registrada correctamente',
            data: movimientos,
            statusCode: 201
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
        
        return successResponse(reply, {
            message: 'Transferencia a jornada registrada exitosamente',
            data: movimiento,
            statusCode: 201
        })
    } catch (error) {
        return handleServiceError(error, reply);
    }
};

export async function createConsumoJornada(req, res) {

    try {

        const {
            productoId,
            cantidad
        } = req.body

        await descontarStockJornada(
            productoId,
            cantidad
        )

        const movimiento = await Movement.create({
            tipo: 'CONSUMO',
            producto: productoId,
            cantidad,
            estado: 'APLICADO'
        })

        return res.status(201).send({
            message: 'Consumo registrado',
            movimiento
        })

    } catch (error) {

        return res.status(400).send({
            message: error.message
        })
    }
}