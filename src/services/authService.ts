import { mockUser } from '../mocks/domain';
import type { User } from '../types/domain';

export type LoginInput = {
  correo: string;
  password: string;
};

export type RegisterInput = {
  nombre: string;
  correo: string;
  password: string;
};

export type AuthResult = {
  token: string;
  user: User;
};

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export async function login(input: LoginInput): Promise<AuthResult> {
  await delay(500);

  if (!input.correo.includes('@') || input.password.length < 6) {
    throw new Error('Correo o contraseña inválidos.');
  }

  return {
    token: 'mock-passenger-token',
    user: {...mockUser, correo: input.correo.trim().toLowerCase()},
  };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  await delay(600);

  if (input.nombre.trim().length < 2) {
    throw new Error('Ingresa tu nombre completo.');
  }

  if (!input.correo.includes('@') || input.password.length < 6) {
    throw new Error('Revisa el correo y usa una contraseña de al menos 6 caracteres.');
  }

  return {
    token: 'mock-passenger-token',
    user: {
      ...mockUser,
      id: 'USR-NEW',
      nombre: input.nombre.trim(),
      correo: input.correo.trim().toLowerCase(),
    },
  };
}
