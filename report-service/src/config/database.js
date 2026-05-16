import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conexión a la base de datos establecida para los reportes`);
    } catch (err) {
        console.error(`Error al conectar a la base de datos: ${err.message}`);
        process.exit(1);
    }
}

export default connectDb;