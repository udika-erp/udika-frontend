import { BaseApiClient } from '@/services/base/BaseApiClient';
import type {
  LoginRequest,
  LoginResponseData,
  RefreshRequest,
  RefreshResponseData,
  LogoutRequest,
  Employee,
} from '../data/type';

export class AuthService extends BaseApiClient {
  constructor() {
    super('/auth');
  }

  async login(data: LoginRequest): Promise<LoginResponseData> {
    return this.POST<LoginResponseData>('/login', data);
  }

  async refresh(data: RefreshRequest): Promise<RefreshResponseData> {
    return this.POST<RefreshResponseData>('/refresh', data);
  }

  async logout(data: LogoutRequest): Promise<void> {
    return this.POST<void>('/logout', data);
  }

  async me(): Promise<Employee> {
    return this.GET<Employee>('/me');
  }
}

export const authService = new AuthService();
