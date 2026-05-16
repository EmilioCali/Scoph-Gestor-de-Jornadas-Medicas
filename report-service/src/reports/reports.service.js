import { SERVICES } from '../config/services.js';

export async function obtenerConsumoJornada(jornadaId) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    //consumir el servicio de core, en conreto los movimientos
    try {
        const response = await fetch(`${SERVICES.core.baseUrl}/api/v1/movimientos?subType=CONSUMO_JORNADA&jornadaId=${jornadaId}`,
            { signal: controller.signal }
        );

        if (!response.ok) throw new Error('Error al consultar movimientos');

        const data = await response.json();

        //agrupar los medicamentos consumidos
        const consumo = {};
        data.data.forEach(mov => {
            mov.detail.forEach(item => {
                const key = item.medicineId;
                if (!consumo[key]) {
                    consumo[key] = {
                        medicineId: item.medicineId,
                        nombre: item.medicamentoSnapshot.name,
                        concentracion: item.medicamentoSnapshot.concentration,
                        totalConsumido: 0
                    };
                }
                consumo[key].totalConsumido += item.quantity;
            });
        });
        return Object.values(consumo);
    } catch (err) {
        if (err.name == 'AbortError') {
            throw new Error('el servicio de movimiento / core no responde (timeout)');
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }
}

//stock actual
export async function obtenerStockActual() {
    const response = await fetch(`${SERVICES.core.baseUrl}/api/v1/inventario-central`);
    if (!response.ok) throw new Error("Error al consultar inventario central");
    const data = await response.json();

    return data.data.map(inv => ({
        medicineId: inv.medicineId._id, //devuleve solo el id del mediaento y no el objeto completo
        nombre: inv.medicineId?.name,
        concentracion: inv.medicineId?.concentration,
        stockTotal: inv.totalStock,
        lotes: inv.lots.map(l => ({
            batch: l.batch,
            stock: l.stock,
            expirationDate: l.expirationDate
        }))
    }));
}

//medicamentos proximos a vencer
//medicamentos cuyos lotes vencen dentro de los próximos X días - por defecto 30
export async function obtenerProximosAVencer(dias = 30) {
    const response = await fetch(`${SERVICES.core.baseUrl}/api/v1/inventario-central`);
    if (!response.ok) throw new Error('Error al consultar el inventario central');

    const data = await response.json();
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);

    const proximosAVencer = [];
    data.data.forEach(inv => {
        inv.lots.forEach(lote => {
            const exp = new Date(lote.expirationDate);
            if (exp <= limite){
                proximosAVencer.push({
                    medicineId: inv.medicineId._id,
                    nombre: inv.medicineId?.name,
                    concentracion: inv.medicineId?.concentration,
                    batch: lote.batch,
                    stock: lote.stock,
                    expirationDate: lote.expirationDate
                });
            }
        });
    })
    return proximosAVencer;
}