import { Schema, model } from 'mongoose';

const lotSchema = new Schema(
  {
    batch: {
      type: String,
      required: [true, 'El número de lote es requerido'],
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

const workdayInventorySchema = new Schema(
  {
    workdayId: {
      type: String,
      required: [true, 'El ID de la jornada es requerido'],
      trim: true,
    },
    workdayName: {
      type: String,
      required: [true, 'El nombre de la jornada es requerido'],
      trim: true,
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: [true, 'El ID del medicamento es requerido'],
    },
    lots: {
      type: [lotSchema],
      default: [],
    },
    totalStock: {
      type: Number,
      required: [true, 'El stock total es requerido'],
      min: [0, 'El stock total no puede ser negativo'],
      default: 0,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false,
  }
);

workdayInventorySchema.index({ workdayId: 1 });
workdayInventorySchema.index({ medicineId: 1 });
workdayInventorySchema.index({ workdayId: 1, medicineId: 1 }, { unique: true });

export default model('WorkdayInventory', workdayInventorySchema);