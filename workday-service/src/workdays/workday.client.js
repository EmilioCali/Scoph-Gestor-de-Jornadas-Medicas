import axios from 'axios';

export async function validarJornadaActiva(userId) {
    const response = await axios.get(
        `${process.env.WORKDAY_SERVICE}/workdays/active/${userId}`
    )

    if (!response.data?.activa) {
        throw new Error('No existe una jornada activa')
    }

    return response.data
}