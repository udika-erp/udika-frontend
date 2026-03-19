import { BaseApiClient } from '@/services/base/BaseApiClient';
import type { LoginRequest, LoginResponseData } from '../data/type';
import { getAccessToken } from '@/services/tokens';

export class AuthService extends BaseApiClient {
  constructor() {
    super('/auth');
  }

  async login(data: LoginRequest): Promise<LoginResponseData> {
    return this.POST<LoginResponseData>('/login', data);
  }

  async logout(): Promise<void> {
    return this.POST<void>('/logout');
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    // Mock implementation: Reuse existing access token
    // TODO: Replace with real API call when backend implements /auth/refresh
    const currentToken = getAccessToken();
    if (!currentToken) throw new Error('No token');
    return { accessToken: currentToken };
  }
}

export const authService = new AuthService();
