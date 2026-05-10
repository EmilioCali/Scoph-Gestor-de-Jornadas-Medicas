import { registrarEntrada } from "../inventory/inventory.service.js";

async function movementPlugin(fastify) {
    fastify.post('/movimientos/entrada', {
        schema: {
            body: {
                type: 'object',
                required: ['tipoEntrada', 'detalle'],
                properties: {
                    tipoEntrada: { type: 'string', enum: ['DONACION', 'COMPRA'] },
                    detalle: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['medicineId', 'batch', 'quantity', 'expirationDate'],
                            properties: {
                                medicineId: { type: 'string' },
                                batch: { type: 'string' },
                                quantity: { type: 'string' },
                                expirationDate: { type: 'string', format: 'date' }
                            }
                        }
                    },
                    destination: {
                        type: 'object',
                        required: ['type'],
                        properties: {
                            type: { type: 'string', enum: ['INVENTARIO_CENTRAL', 'INVENTARIO_JORNADA'] },
                            id: { type: 'string', nullable: true }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const movimientos = await registrarEntrada({
                tipoEntrada: request.body.tipoEntrada,
                detalle: request.body.detalle,
                destination: request.body.destination,
                userId: request.user?.id || 'system'
            })
            return reply.status(201).send({ ok: true, movimientos })
        } catch (err) {
            return reply.status(400).send({ ok: false, message: err.message })
        }
    }

    )
}

export default movementPlugin;