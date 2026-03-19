export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginResponse {
  success: true;
  data: LoginResponseData;
  message: string;
}

export interface LogoutResponse {
  success: true;
  message: string;
}
