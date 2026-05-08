import { createWorkday, getWorkdays } from './workday.controller.js';

async function workdayRoutes(fastify, options) {
    fastify.post('/workdays', createWorkday);
    fastify.get('/workdays', getWorkdays);
}

export default workdayRoutes;