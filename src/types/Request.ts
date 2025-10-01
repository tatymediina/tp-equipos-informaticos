export interface IJWTUser {
  id: string;
  rol: string;
  nombre?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface IAuthRequest extends Request {
  user?: IJWTUser;
  // Puedes agregar más propiedades personalizadas si las necesitas
  requestId?: string;
  startTime?: number;
}

// Tipo para requests que siempre requieren autenticación
export interface IAuthenticatedRequest extends Request {
  user: IJWTUser; // user es obligatorio aquí
}