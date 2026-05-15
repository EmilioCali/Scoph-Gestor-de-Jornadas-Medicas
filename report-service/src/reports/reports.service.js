import { SERVICES } from '../config/services.js';

export async function obtenerConsumoJornada(jornadaId){
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    //consumir el servicio de core, en conreto los movimientos
    try {
        const response = await fetch(`${SERVICES.core.baseUrl}/api/v1/movimientos?subType=CONSUMO_JORNADA&jornadaId=${jornadaId}`,
            {signal: controller.signal}
        );

        if(!response.ok) throw new Error('Error al consultar movimientos');

        const data = await response.json();

        //agrupar los medicamentos consumidos
        const consumo = {};
        data.data.forEach(mov =>{
            mov.detail.forEach(item =>{
                if(!consumo[key]){
                    consumo[key]= {
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
        if(err.name == 'AbortError'){
            throw new Error('el servicio de movimiento / core no responde (timeout)');
        }
        throw err;
    }finally{
        clearTimeout(timeout);
    }
}