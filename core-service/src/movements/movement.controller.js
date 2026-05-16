import Movement from './movement.model.js'
import {
    registrarEntrada,
    registrarSalidaReceta,
    registrarTransferencia,
    descontarStockJornada,
    procesarRetornoJornada
} from '../inventory/inventory.service.js';
import { handleServiceError } from '../utils/errorHandler.js';
import { successResponse } from '../utils/response.js';

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

export const createConsumoJornada = async (request, reply) => {
    try {
        const { productoId, cantidad } = request.body;

        const { inventory, lote, medicine } = await descontarStockJornada(productoId, cantidad);

        const movimiento = await Movement.create({
            type: 'SALIDA',
            subType: 'CONSUMO_JORNADA',
            origin: { type: 'INVENTARIO_JORNADA', id: inventory.workdayId },
            destination: { type: 'EXTERNO', id: null },
            detail: [{
                medicineId: medicine._id,
                medicationSnapshot: {
                    name: medicine.name,
                    concentration: medicine.concentration
                },
                batch: lote.batch,
                quantity,
                expirationDate: lote.expirationDate
            }],
            status: 'APLICADO',
            userId: request.user?.id || 'system',
            appliedAt: new Date()
        });

        return successResponse(reply, {
            message: 'Consumo registrado',
            data: movimiento,
            statusCode: 201
        });
    } catch (error) {
        return handleServiceError(error, reply);
    }
};

export const createRetornoJornada = async (request, reply) => {
    try {
        const { productoId, cantidad } = request.body;

        const { inventory, lote, medicine } = await procesarRetornoJornada(productoId, cantidad);

        const movimiento = await Movement.create({
            type: 'ENTRADA',
            subType: 'RETORNO_JORNADA',
            origin: { type: 'EXTERNO', id: null },
            destination: { type: 'INVENTARIO_JORNADA', id: inventory.workdayId },
            detail: [{
                medicineId: medicine._id,
                medicationSnapshot: {
                    name: medicine.name,
                    concentration: medicine.concentration
                },
                batch: lote.batch,
                quantity,
                expirationDate: lote.expirationDate
            }],
            status: 'APLICADO',
            userId: request.user?.id || 'system',
            appliedAt: new Date()
        });

        return successResponse(reply, {
            message: 'Retorno registrado',
            data: movimiento,
            statusCode: 201
        });
    } catch (error) {
        return handleServiceError(error, reply);
    }
};

export const getMovimientos = async (request, reply) => {
    try {
        const { subType, jornadaId } = request.query;

        const filtros ={};
        if(subType) filtros.subType = subType;
        if(jornadaId) filtros["destination.id"] = jornadaId;

        const movimientos = await Movement.find(filtros);
        return reply.status(200).send({
            sucess: true,
            message: 'Movimientos consultados con exito',
            data: movimientos
        });

    } catch (err) {
        return reply.status(400).send({
            success: false,
            message: 'Error al consultar movimeintos',
            error: err.message
        });
    }
}