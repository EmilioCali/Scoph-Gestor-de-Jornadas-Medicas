import { getConsumoJornada } from "./reportes.controller.js";

const reportesRoutes = async (fastify) =>{
    fastify.get('/reportes/consumo-jornada/:id', getConsumoJornada);
}

export default reportesRoutes;