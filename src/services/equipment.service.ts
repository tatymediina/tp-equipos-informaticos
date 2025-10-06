import EquipmentModel, { IEquipmentDocument } from '../models/equipment.model';
import { IEquipment, IEquipmentCreate, IEquipmentUpdate } from '../types/IEquipment';

// !  Servicio para manejar la lógica de negocio de equipos
export class EquipmentService {
  // ! Convierte un documento de equipo a IEquipment
   
  private toEquipmentObject(equipment: IEquipmentDocument): IEquipment {
    return {
      _id: equipment._id.toString(), // Convertir ObjectId a string
      name: equipment.name,
      type: equipment.type,
      brand: equipment.brand,
      EquipmentModel: equipment.EquipmentModel,
      serialNumber: equipment.serialNumber,
      status: equipment.status,
      assignedTo: equipment.assignedTo?.toString(),
      specifications: equipment.specifications,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt
    };
  }

  // ! Obtiene todos los equipos con paginación
   
  public async getAllEquipment(
    page: number = 1,
    limit: number = 10,
    filters: any = {}
  ): Promise<{ equipment: IEquipment[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    // ! Construir query de filtros
    const query: any = {};
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.brand) query.brand = { $regex: filters.brand, $options: 'i' };

    const [equipment, total] = await Promise.all([
      EquipmentModel.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EquipmentModel.countDocuments(query)
    ]);

    // ! Convertir documentos de Mongoose a objetos simples
    const equipmentArray = equipment.map(eq => this.toEquipmentObject(eq));

    return {
      equipment: equipmentArray,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // ! Obtiene un equipo por ID
  
  public async getEquipmentById(id: string): Promise<IEquipment> {
    const equipment = await EquipmentModel.findById(id).populate('assignedTo', 'name email');
    if (!equipment) {
      throw new Error('Equipo no encontrado');
    }
    return this.toEquipmentObject(equipment);
  }

  // ! Crea un nuevo equipo
   
  public async createEquipment(equipmentData: IEquipmentCreate): Promise<IEquipment> {
    // Verificar si el número de serie ya existe
    const existingEquipment = await EquipmentModel.findOne({ 
      serialNumber: equipmentData.serialNumber 
    });
    if (existingEquipment) {
      throw new Error('El número de serie ya está registrado');
    }

    const equipment = await EquipmentModel.create(equipmentData);
    return this.toEquipmentObject(equipment);
  }

  // ! Actualiza un equipo existente
   
  public async updateEquipment(id: string, updateData: IEquipmentUpdate): Promise<IEquipment> {
    const equipment = await EquipmentModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!equipment) {
      throw new Error('Equipo no encontrado');
    }

    return this.toEquipmentObject(equipment);
  }

  // ! Elimina un equipo
   
  public async deleteEquipment(id: string): Promise<void> {
    const equipment = await EquipmentModel.findByIdAndDelete(id);
    if (!equipment) {
      throw new Error('Equipo no encontrado');
    }
  }

  // ! Obtiene equipos asignados a un usuario específico
   
  public async getEquipmentByUser(userId: string): Promise<IEquipment[]> {
    const equipment = await EquipmentModel.find({ assignedTo: userId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return equipment.map(eq => this.toEquipmentObject(eq));
  }
}