import centralInventory from "./centralInventory.model.js";

export const getInventarioCentral = async (request, reply) => {
    try {
        const inventarios = await centralInventory.find().populate("medicineId");
        return reply.status(200).send({
            success: true,
            message: "Inventario central",
            data: inventarios
        });
    } catch (error) {
        return reply.status(400).send({
            success: false,
            message: "Error al consultar inventario central",
            error: error.message
        });
    }
};
