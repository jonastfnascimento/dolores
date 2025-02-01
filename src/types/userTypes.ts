export interface User {
  id: string;
  nome: string;
  email: string;
  created_at: string;
}

export interface LoginSuccessResponse {
  message: 'Login Allowed';
  user: User;
}

export interface LoginFailureResponse {
  message: 'Login Not Allowed';
}

export type LoginResponse = LoginSuccessResponse | LoginFailureResponse;
