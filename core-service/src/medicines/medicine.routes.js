import { createMedicine } from './medicine.controller.js';

const medicineRoutes = async (fastify) => {
    fastify.post('/medicines', createMedicine);
};

export default medicineRoutes;