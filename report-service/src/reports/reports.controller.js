import { obtenerConsumoJornada } from "./reports.service.js";

export const getConsumoJornada = async(request, reply) => {
    try {
        const jornadaId = request.params.id;
        const consumo = await obtenerConsumoJornada(jornadaId);

        return reply.status(200).send({
            success: true,
            message: 'Consumo de medicamentos por jornada',
            data: consumo
        });
    } catch (err) {
        return reply.status(400).send({
            success: false,
            message: 'Error al consultar el consumo por jornada especifica',
            error: err.message
        });
    }
};