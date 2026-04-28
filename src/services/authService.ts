import { apiClient } from './apiClient';
import { getErrorMessage } from './apiErrors';
import type { OperationalStatus, User, UserRole } from '../types/domain';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthResult = {
  token: string;
  user: User;
};

type AuthUserResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: OperationalStatus;
};

type LoginResponse = {
  token: string;
  user: AuthUserResponse;
};

function mapUser(user: AuthUserResponse): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  try {
    const {data} = await apiClient.post<LoginResponse>('/auth/login', input);

    return {
      token: data.token,
      user: mapUser(data.user),
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible iniciar sesión.'));
  }
}

export async function getCurrentUser() {
  try {
    const {data} = await apiClient.get<AuthUserResponse>('/auth/me');
    return mapUser(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible validar la sesión.'));
  }
}

export async function getUserById(userId: string) {
  try {
    const {data} = await apiClient.get<AuthUserResponse>(`/users/${userId}`);
    return mapUser(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible consultar el perfil.'));
  }
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cerrar sesión.'));
  }
}

export async function register(_: RegisterInput): Promise<AuthResult> {
  throw new Error(
    'El backend actual no permite registro público. Solicita a operaciones que cree tu usuario.',
  );
}
