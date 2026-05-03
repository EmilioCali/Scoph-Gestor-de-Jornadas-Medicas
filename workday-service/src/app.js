import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';


const app = Fastify({
    logger:{
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options:{
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
    }
});

//seguridad
await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

await app.register(helmet);

await app.register(rateLimit, {
    max: 10,
    timeWindow: '10 minutes',
    errorResponseBuilder: (req, context) =>({
        success: false,
        message: `Demasiadas peticiones desde esta IP, por favor intente nuevamenente despues de ${Math.ceil(context.ttl / 1000)} segundos`,
        error: 'RATE_LIMIT_EXCEEDED',
        retryAfter: context.after
    })
});

//registrar rutas y swagger aqui


//healtycheck
app.get('/api/v1/health', async () => ({
    status: 'ok',
    message: 'Servicio de jornadas funcionando correctamente',
    timestamp: new Date().toISOString()
}));

//manejo de errores
app.setErrorHandler((error, request, reply) =>{
    request.log.error({
        message: error.message,
        stack: error.stack
    });

    reply.status(error.statusCode || 500).send({
        status: 'error',
        message: error.message || 'Internal Server Error'
    });
});

export default app;