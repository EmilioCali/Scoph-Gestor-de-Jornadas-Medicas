import dotenv from 'dotenv';
import connectDb from './config/database.js'
import app from './app.js';

dotenv.config();

const start = async () => {
    try {
        await connectDb();

        await app.listen({
            port: process.env.PORT,
            host: '0.0.0.0'
        });

        console.log(`Servicio de Reportes corriendo en el puerto ${process.env.PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();