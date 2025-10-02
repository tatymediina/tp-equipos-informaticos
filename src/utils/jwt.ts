import jwt from 'jsonwebtoken';
import { IUserResponse } from '../types/IUser';

/**
 * Clase utilitaria para el manejo de JWT
 */
export class JWTHelper {
  private static readonly SECRET = process.env.JWT_SECRET || 'fallback_secret';
  private static readonly EXPIRES_IN =  '24h';

  /**
   * Interfaz para el payload del token JWT
   */
  private static jwtPayload(user: IUserResponse): {
    id: string;
    email: string;
    role: 'admin' | 'user';
    name: string;
  } {
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };
  }

  /**
   * Interfaz para las opciones del token JWT
   */
  private static jwtOptions(): jwt.SignOptions {
    return {
      expiresIn: this.EXPIRES_IN
    };
  }

  /**
   * Genera un token JWT para un usuario
   */
  public static generateToken(user: IUserResponse): string {
    const payload = this.jwtPayload(user);
    const options = this.jwtOptions();

    return jwt.sign(payload, this.SECRET, options);
  }

  /**
   * Verifica y decodifica un token JWT
   */
  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.SECRET);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Decodifica un token sin verificar (útil para obtener información básica)
   */
  public static decodeToken(token: string): any {
    return jwt.decode(token);
  }

  /**
   * Extrae el token del header de autorización
   */
  public static extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    return null;
  }
}