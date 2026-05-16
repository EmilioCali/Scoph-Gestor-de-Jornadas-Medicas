import { obtenerConsumoJornada, obtenerStockActual } from "./reports.service.js";
import { SERVICES } from '../config/services.js';

export const getConsumoJornada = async (request, reply) => {
    try {
        const { jornadaId } = request.params;

        const response = await fetch(`${SERVICES.core.baseUrl}/api/v1/movimientos?subType=CONSUMO_JORNADA&originId=${jornadaId}`);
        if (!response.ok) {
            throw new Error("Error al consultar movimientos en core-service");
        }

        const data = await response.json();

        //extraer solo el detalle de cada movimiento
        const detalles = data.data.flatMap(mov => mov.detail);

        return reply.status(200).send({
            success: true,
            message: "Consumo de medicamentos por jornada",
            data: detalles
        });
    } catch (err) {
        return reply.status(400).send({
            success: false,
            message: "Error al consultar consumo",
            error: err.message
        });
    }
};



export const getStockActual = async (request, reply) => {
    try {
        const stock = await obtenerStockActual();
        return reply.status(200).send({ success: true, message: "Stock actual", data: stock });
    } catch (err) {
        return reply.status(400).send({ success: false, message: "Error al consultar stock", error: err.message });
    }
};