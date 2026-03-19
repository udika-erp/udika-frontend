import { api } from '../api';
import type { ApiResponse } from '../api.types';

export abstract class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Unwrap backend response: { success, data, message } → returns data
  protected async GET<T>(url: string, params?: object): Promise<T> {
    const response = await api.get<ApiResponse<T>>(this.baseUrl + url, { params });
    return response.data.data;
  }

  protected async POST<T>(url: string, data?: object): Promise<T> {
    const response = await api.post<ApiResponse<T>>(this.baseUrl + url, data);
    return response.data.data;
  }

  protected async PUT<T>(url: string, data?: object): Promise<T> {
    const response = await api.put<ApiResponse<T>>(this.baseUrl + url, data);
    return response.data.data;
  }

  protected async DELETE<T>(url: string): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(this.baseUrl + url);
    return response.data.data;
  }
}
