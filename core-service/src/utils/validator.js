export function validarLoteExistente(lote){
    if (!lote) {
        throw new Error('El lote no existe');
    }
}

