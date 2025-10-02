import UserModel, { IUserDocument } from '../models/user.model';
import { PasswordHelper } from '../utils/password';
import { JWTHelper } from '../utils/jwt';
import { IUserCreate, IUserLogin, IUserResponse } from '../types/IUser';

/**
 * Servicio para manejar la lógica de negocio de autenticación
 */
export class AuthService {
  /**
   * Convierte un documento de usuario a IUserResponse
   */
  private toUserResponse(user: IUserDocument): IUserResponse {
    return {
      _id: user._id.toString(), // Convertir ObjectId a string
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt!
    };
  }

  /**
   * Registra un nuevo usuario
   */
  public async register(userData: IUserCreate): Promise<{ user: IUserResponse; token: string }> {
    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await PasswordHelper.hash(userData.password);

    // Crear el usuario
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword
    });

    // Generar token
    const userResponse = this.toUserResponse(user);
    const token = JWTHelper.generateToken(userResponse);

    return { user: userResponse, token };
  }

  /**
   * Inicia sesión de un usuario
   */
  public async login(credentials: IUserLogin): Promise<{ user: IUserResponse; token: string }> {
    // Buscar usuario por email
    const user = await UserModel.findOne({ email: credentials.email });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new Error('La cuenta está desactivada');
    }

    // Verificar contraseña
    const isPasswordValid = await PasswordHelper.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const userResponse = this.toUserResponse(user);
    const token = JWTHelper.generateToken(userResponse);

    return { user: userResponse, token };
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  public async getProfile(userId: string): Promise<IUserResponse> {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.toUserResponse(user);
  }
}