import { Schema, model } from 'mongoose';

const lotSchema = new Schema(
    {
        batch: {
        type: String,
        required: [true, 'El lote es requerido'],
        trim: true,
        },

        expirationDate: {
        type: Date,
        required: [true, 'La fecha de vencimiento es requerida'],
        },

        stock: {
        type: Number,
        required: [true, 'El stock es requerido'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0,
        },
    },
    { _id: false }
    );

    const inventoryCentralSchema = new Schema(
    {
        medicineId: {
            type: Schema.Types.ObjectId,
            ref: 'Medicine',
            required: [true, 'El ID de medicamento es requerido'],
            trim: true,
        },

        lots: {
            type: [lotSchema],
            default: [],
        },

        totalStock: {
            type: Number,
            required: [true, 'El stock total es requerido'],
            default: 0,
            min: [0, 'El stock total no puede ser negativo'],
        },

        minimumStock: {
            type: Number,
            required: [true, 'El stock mínimo es requerido'],
            default: 0,
            min: [0, 'El stock mínimo no puede ser negativo'],
        },
    },
    {
        timestamps: { createdAt: false, updatedAt: true },
        versionKey: false,
    }
);

inventoryCentralSchema.index({ medicineId: 1 }, { unique: true });

export default model('InventoryCentral', inventoryCentralSchema);