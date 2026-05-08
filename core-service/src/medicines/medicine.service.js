import Medicine from './medicine.model.js';

export const createMedicineRecord = async (medicineData) => {
    const medicine = new Medicine(medicineData);
    return await medicine.save();
};