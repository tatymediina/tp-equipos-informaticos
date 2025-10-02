import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { IUserCreate, IUserLogin } from '../types/IUser';
import { IAuthRequest } from '../types/IAuthRequest';

const authService = new AuthService();

export class AuthController {
  // ! Registra un nuevo usuario
   
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: IUserCreate = req.body;
      const result = await authService.register(userData);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ! Inicia sesión de usuario
   
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: IUserLogin = req.body;
      const result = await authService.login(credentials);

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // ! Obtiene el perfil del usuario actual
  
  public async getProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id!;
      const user = await authService.getProfile(userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}