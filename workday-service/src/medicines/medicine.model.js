import { Schema, model } from 'mongoose';

const medicineSchema = new Schema(
    {
        barcode: {
            type: String,
            required: [true, 'El código de barras es requerido'],
            trim: true,
            unique: true,
        },

        name: {
            type: String,
            required: [true, 'El nombre del medicamento es requerido'],
            trim: true,
            maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
        },

        compound: {
            type: String,
            required: [true, 'El compuesto es requerido'],
            trim: true,
            maxLength: [100, 'El compuesto no puede exceder 100 caracteres'],
        },

        concentration: {
            type: String,
            required: [true, 'La concentración es requerida'],
            trim: true,
        },

        presentation: {
            type: String,
            required: [true, 'La presentación es requerida'],
            trim: true,
        },

        unitMeasure: {
            type: String,
            required: [true, 'La unidad de medida es requerida'],
            trim: true,
        },

        category: {
            type: String,
            required: [true, 'La categoría es requerida'],
            enum: {
                values: ['ANTIBIOTICS', 'ANALGESICS', 'ANTIINFLAMMATORY', 'VITAMINS', 'OTHER'],
                message: 'Categoría no válida',
            },
        },

        status: {
            type: String,
            required: [true, 'El estado es requerido'],
            enum: {
                values: ['ACTIVE', 'INACTIVE'],
                message: 'Estado no válido',
            },
            default: 'ACTIVE',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

medicineSchema.index({ barcode: 1 });
medicineSchema.index({ name: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ status: 1 });

export default model('Medicine', medicineSchema);