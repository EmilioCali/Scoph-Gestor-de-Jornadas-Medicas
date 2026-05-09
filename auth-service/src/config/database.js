import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('La variable de entorno MONGODB_URI es requerida')
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✔ MongoDB conectado correctamente')
  } catch (err) {
    console.error('✘ Error al conectar con MongoDB:', err.message)
    throw err
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB desconectado')
})

mongoose.connection.on('error', (err) => {
  console.error('Error en la conexión de MongoDB:', err.message)
})

export default mongoose
