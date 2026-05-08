import { createMedicineRecord } from './medicine.service.js';

export const createMedicine = async (request, reply) => {
    try {
        const medicine = await createMedicineRecord(request.body);
        
        return reply.status(201).send({
            success: true,
            message: 'Medicamento creado exitosamente',
            data: medicine,
        });
    } catch (error) {
            return reply.status(400).send({
            success: false,
            message: 'Error al crear el medicamento',
            error: error.message,
        });
    }
};