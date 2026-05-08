import { createWorkday } from './workday.controller.js';

async function workdayRoutes(fastify, options) {
    fastify.post('/workdays', createWorkday);
}

export default workdayRoutes;