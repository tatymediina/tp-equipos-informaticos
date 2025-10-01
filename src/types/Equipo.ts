type StateType = "Disponible" | "Asignado" | "En Mantenimiento" | "Baja";
type productType = 'Laptop' |'Desktop' |'Monitor' |'Impresora' |'Servidor'

export interface IEquipo {
    _id?: string,
    name: string,
    type: productType,
    brand: string,
    model: string,
    serialNumber: string,
    state: StateType,
    responsible: string,
    specifications:{
        processor: string,
        ram: string,
        storage: string
    }
}