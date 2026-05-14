export function validarLoteExistente(lote){
    if (!lote) {
        throw new Error('El lote no existe');
    }
}

export function validarNoVencido(fechaVencimiento) {
    const hoy = new Date();

    if (new Date(fechaVencimiento) < hoy){
        throw new Error('El lote está vencido');
    }
}

export function validarStockPositivo(stock){
    if(stock <= 0){
        throw new Error('El lote no tiene stock disponible');
    }
}
