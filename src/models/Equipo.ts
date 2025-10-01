import { Schema, model } from "mongoose";
import type { IEquipo } from "../types/Equipo";

const equipoSchema = new Schema<IEquipo>({
    name: { type: String, required: true },
    type: { type: String, enum:['Laptop', 'Desktop', 'Monitor', 'Impresora', 'Servidor'] , default: "Laptop" },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    state: { type: String, enum: ["Disponible", "Mantenimiento", "Asignado", "Baja"],  default: "Disponible" },
    responsible: { type: String, required: true },
    specifications: {
        processor: { type: String, required: true },
        ram: { type: String, required: true },
        storage: { type: String, required: true },
    },
});

export const Equipo = model<IEquipo>("Equipo", equipoSchema);