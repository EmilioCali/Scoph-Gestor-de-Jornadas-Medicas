import { getInventarioCentral } from './inventory.controller.js';

const inventoryRoutes = async (fastify) =>{
    fastify.get('/inventario-central', getInventarioCentral);
}

export default inventoryRoutes;