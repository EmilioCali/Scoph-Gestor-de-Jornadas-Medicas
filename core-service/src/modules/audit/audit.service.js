import Audit from './audit.model.js'

export async function registerAudit({
    userId,
    action,
    module,
    reference,
    description
}) {

    try {

        return await Audit.create({
            userId,
            action,
            module,
            reference,
            description
        })

    } catch (error) {
        console.error('Error registrando auditoría', error);
        throw error;
    }
}
