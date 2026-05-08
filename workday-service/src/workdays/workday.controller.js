import Workday from './workday.model.js';

export const createWorkday = async (request, reply) => {
    try {
        const workday = await Workday.create(request.body);

        return reply.status(201).send({
        success: true,
        message: 'Jornada creada exitosamente',
        data: workday,
        });
    } catch (error) {
        return reply.status(400).send({
        success: false,
        message: 'Error al crear la jornada',
        error: error.message,
        });
    }
};