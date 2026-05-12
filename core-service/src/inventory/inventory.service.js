import centralInventory from "./centralInventory.model.js";
import Movement from '../movements/movement.model.js'
import Medicine from '../medicines/medicine.model.js'
import WorkdayInventory from './workdayInventory.model.js';
import { getWorkdayById } from '../workdays/workday.client.js';

export async function registrarEntrada({ tipoEntrada, detalle, userId, destination, metadata }) {
    const movimientos = [];

    for (const item of detalle) {
        const { medicineId, batch, quantity, expirationDate } = item;

        //validaciones de integridad de lote - TKT-018
        if (quantity <= 0) throw new Error("La cantidad debe de ser positiva");
        if (new Date(expirationDate) <= new Date()) throw new Error("La fecha de vencimiento debe de ser una futura");

        const med = await Medicine.findById(medicineId);
        if (!med) throw new Error("Medicamento no encontrado");

        //crear movimienti - TKT-016
        const movimiento = new Movement({
            type: 'ENTRADA',
            subType: tipoEntrada,
            origin: { type: 'EXTERNO' }, //ya que es de afuera donde se obtiene ya sea compra o donación
            destination,
            detail: [{
                medicineId,
                medicationSnapshot: { name: med.name, concentration: med.concentration },
                batch,
                quantity,
                expirationDate
            }],
            status: 'APLICADO',
            userId,
            appliedAt: new Date()
        })
        await movimiento.save();
        movimientos.push(movimiento)

        //actualizar inventario centraal TKT-017
        let inv = await centralInventory.findOne({ medicineId })
        if (!inv) {
            inv = new centralInventory({ medicineId, lots: [], totalStock: 0 })
        }

        const loteExistente = inv.lots.find(l => l.batch === batch)
        if (loteExistente) {
            loteExistente.stock += quantity
        } else {
            inv.lots.push({ batch, expirationDate, stock: quantity })
        }

        inv.totalStock += quantity
        await inv.save()

    }
    return movimientos
}

//salida por receta
export async function registrarSalidaReceta({ detalle, userId, destination, metadata }){
    const movimientos = [];

    for(const item of detalle){
        const { medicineId, batch, quantity } = item;

        //validar que exista dicho medicamento
        const med = await Medicine.findById(medicineId);
        if(!med) throw new Error("Medicamento no encontrado, lo siento");

        //TKT-020 validación de stock disponible
        const inv = await centralInventory.findOne({ medicineId });
        if(!inv) throw new Error("No existe inventario para este medicamento");

        const lote = inv.lots.find(l => l.batch === batch); //batch = lotes
        if(!lote) throw new Error("El lote no se ha encontrado");

        if(lote.stock < quantity){
            throw new Error(`Stock insuficiente en el lote ${batch}. Disponible: ${lote.stock}, solicitado: ${quantity}`);
            
        }
        
        //descuento de stock
        lote.stock -= quantity;
        inv.totalStock -= quantity;

        //eviatar valores negativos
        if(lote.stock < 0) lote.stock = 0;
        if(inv.totalStock < 0) inv.totalStock = 0;

        await inv.save();
        

        //crear movimiento TKT-019
        const movimiento = new Movement({
            type: "SALIDA",
            subType: "RECETA",
            origin: { type: "INVENTARIO_CENTRAL", id: null },
            destination,
            detail: [{
                medicineId,
                medicationSnapshot: { name: med.name, concentration: med.concentration },
                batch,
                quantity,
                expirationDate: lote.expirationDate
            }],
            status: "APLICADO",
            userId,
            metadata, //preescription y razon
            appliedAt: new Date()
        });

        await movimiento.save();
        movimientos.push(movimiento);
        
    }
    return movimientos;

}

export async function registrarTransferencia({ jornadaId, jornadaNombre, detalle, userId }) {
    const movimientos = [];
    await getWorkdayById(jornadaId);

    for (const item of detalle) {
        const { medicineId, batch, quantity } = item;

        const med = await Medicine.findById(medicineId);
        if (!med) throw new Error('Medicamento no encontrado');

        // Validar inventario central
        const inv = await centralInventory.findOne({ medicineId });
        if (!inv) throw new Error('No existe inventario para este medicamento');
        
        const lote = inv.lots.find(l => l.batch === batch);
        if (!lote) throw new Error('El lote no se ha encontrado');

        if (lote.stock < quantity) {
        throw new Error(`Stock insuficiente en el lote ${batch}. Disponible: ${lote.stock}, solicitado: ${quantity}`);
    }

    // Descontar del inventario central
    lote.stock -= quantity;
    inv.totalStock -= quantity;
    if (lote.stock < 0) lote.stock = 0;
    if (inv.totalStock < 0) inv.totalStock = 0;
    await inv.save();

    // Sumar al inventario de jornada
    let invJornada = await WorkdayInventory.findOne({ workdayId: jornadaId, medicineId });
    if (!invJornada) {
        invJornada = new WorkdayInventory({
            workdayId: jornadaId,
            workdayName: jornadaNombre,
            medicineId,
            lots: [],
            totalStock: 0
        });
    }

    const loteJornada = invJornada.lots.find(l => l.batch === batch);
    if (loteJornada) {
        loteJornada.stock += quantity;
    } else {
        invJornada.lots.push({ batch, expirationDate: lote.expirationDate, stock: quantity });
    }
    invJornada.totalStock += quantity;
    await invJornada.save();

    const movimiento = new Movement({
        type: 'TRANSFERENCIA',
        subType: 'ASIGNACION_JORNADA',
        origin: { type: 'INVENTARIO_CENTRAL', id: null },
        destination: { type: 'INVENTARIO_JORNADA', id: jornadaId },
        detail: [{
            medicineId,
            medicationSnapshot: { name: med.name, concentration: med.concentration },
            batch,
            quantity,
            expirationDate: lote.expirationDate
        }],
        status: 'APLICADO',
        userId,
        metadata: { reason: `Asignación a jornada ${jornadaNombre}` },
        appliedAt: new Date()
        });

        await movimiento.save();
        movimientos.push(movimiento);
    }

    return movimientos;
}