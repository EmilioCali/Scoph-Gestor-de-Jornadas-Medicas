import { createWorkday, getWorkdays, getWorkdayById } from './workday.controller.js';

async function workdayRoutes(fastify, options) {
    fastify.post('/workdays', createWorkday);
    fastify.get('/workdays', getWorkdays);
    fastify.get('/workdays/:id', getWorkdayById);
}

export default workdayRoutes;