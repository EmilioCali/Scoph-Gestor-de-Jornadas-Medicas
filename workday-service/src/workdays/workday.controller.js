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

export const getWorkdays = async (request, reply) => {
    try {
        const workdays = await Workday.find();

        return reply.status(200).send({
        success: true,
        data: workdays,
        });
    } catch (error) {
        return reply.status(500).send({
        success: false,
        message: 'Error al obtener las jornadas',
        error: error.message,
        });
    }
};