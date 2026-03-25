import { BaseApiClient } from '@/services/base/BaseApiClient';
import type {
  Employee,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForceChangePasswordRequest,
} from '../data/type';

/**
 * ProfileService - Handles profile and password-related API calls
 * Endpoint: /api/users
 */
export class ProfileService extends BaseApiClient {
  constructor() {
    super('/users');
  }

  /**
   * Get current user's profile
   * GET /api/users/me
   */
  async getProfile(): Promise<Employee> {
    return this.GET<Employee>('/me');
  }

  /**
   * Update user's profile (name, phone, avatar)
   * PUT /api/users/me/profile
   * Only editable fields: name, phone, avatar
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return this.PUT<UpdateProfileResponse>('/me/profile', data);
  }

  /**
   * Upload avatar image
   * POST /api/users/me/avatar
   * Expects multipart/form-data with 'file' field
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const { api } = await import('@/services/api');
    const response = await api.post<{ data: { avatarUrl: string } }>(
      this.baseUrl + '/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  /**
   * Change password (self-service)
   * POST /api/auth/change-password
   * Requires current password verification
   */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const { api } = await import('@/services/api');
    const response = await api.post<{ data: ChangePasswordResponse }>(
      '/auth/change-password',
      data
    );
    return response.data.data;
  }

  /**
   * Force change password (admin reset or first login)
   * POST /api/auth/force-change-password
   * Does NOT require current password
   */
  async forceChangePassword(
    data: ForceChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    const { api } = await import('@/services/api');
    const response = await api.post<{ data: ChangePasswordResponse }>(
      '/auth/force-change-password',
      data
    );
    return response.data.data;
  }
}

export const profileService = new ProfileService();
