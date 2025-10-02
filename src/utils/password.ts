import bcrypt from 'bcryptjs';

/**
 * Clase utilitaria para el manejo de contraseñas
 */
export class PasswordHelper {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hashea una contraseña usando bcrypt
   */
  public static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con un hash
   */
  public static async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Valida la fortaleza de una contraseña
   */
  public static validateStrength(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Puedes agregar más validaciones de fortaleza aquí
    return { isValid: true };
  }
}