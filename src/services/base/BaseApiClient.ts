import { api } from '../api';
import type { ApiResponse } from '../api.types';

export abstract class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Unwrap backend response: { success, data, message } → returns data
  public async GET<T>(url: string, params?: object): Promise<T> {
    console.log(`[BaseApiClient.GET] ${this.baseUrl}${url} with params:`, params); // DEBUG
    const response = await api.get<ApiResponse<T>>(this.baseUrl + url, { params });
    console.log(`[BaseApiClient.GET] Full response:`, response.data); // DEBUG
    console.log(`[BaseApiClient.GET] Unwrapped data:`, response.data.data); // DEBUG
    return response.data.data;
  }

  public async POST<T>(url: string, data?: object): Promise<T> {
    const response = await api.post<ApiResponse<T>>(this.baseUrl + url, data);
    return response.data.data;
  }

  public async PUT<T>(url: string, data?: object): Promise<T> {
    const response = await api.put<ApiResponse<T>>(this.baseUrl + url, data);
    return response.data.data;
  }

  public async DELETE<T>(url: string): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(this.baseUrl + url);
    return response.data.data;
  }
}
