import { Response, NextFunction } from 'express';
import { JWTHelper } from '../utils/jwt';
import UserModel from '../models/user.model';
import { IAuthRequest } from '../types/IAuthRequest';
import { IUser } from '../types/IUser';

/**
 * Middleware para verificar el token JWT
 */
export const authenticateToken = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    console.log(req)
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
      return;
    }

    const decoded = JWTHelper.verifyToken(token);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
      return;
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

/**
 * Middleware para verificar roles de administrador
 */
export const requireAdmin = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Se requieren privilegios de administrador'
    });
    return;
  }
  next();
};

/**
 * Middleware para verificar si el usuario es admin o el propietario del recurso
 */
export const requireAdminOrOwner = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?._id?.toString();
  const resourceUserId = req.params.userId;

  if (req.user?.role === 'admin' || userId === resourceUserId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: 'No tienes permisos para acceder a este recurso'
  });
};