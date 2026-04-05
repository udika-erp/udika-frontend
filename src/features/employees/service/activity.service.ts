import { BaseApiClient } from '@/services/base/BaseApiClient';
import type { Activity, CreateActivityRequest } from '../types';

interface ActivityFilters {
  targetType?: string;
  targetId?: string;
  type?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

/**
 * Activity Service
 * Manages all API calls for activities/notes functionality
 * Activities are polymorphic entities that can be associated with different target types
 */
export class ActivityService extends BaseApiClient {
  constructor() {
    super('/activities');
  }

  /**
   * GET /activities
   * Retrieve activities with filters
   *
   * @param filters - Query parameters (targetType, targetId, page, limit, etc.)
   * @returns Response with paginated activities
   */
  async getActivities(filters: ActivityFilters): Promise<{ data: Activity[] }> {
    return this.GET<{ data: Activity[] }>('', filters);
  }

  /**
   * POST /activities
   * Create a new activity/note
   *
   * @param data - Activity data
   * @returns Created Activity
   */
  async create(data: CreateActivityRequest): Promise<Activity> {
    return this.POST<Activity>('', data);
  }

  /**
   * PUT /activities/{id}
   * Update an activity/note
   *
   * @param id - Activity ID
   * @param data - Updated activity data
   * @returns Updated Activity
   */
  async update(id: string, data: Partial<CreateActivityRequest>): Promise<Activity> {
    return this.PUT<Activity>(`/${id}`, data);
  }

  /**
   * DELETE /activities/{id}
   * Delete an activity/note (soft delete)
   *
   * @param id - Activity ID
   * @returns void
   */
  async delete(id: string): Promise<void> {
    return this.DELETE<void>(`/${id}`);
  }
}

/**
 * Singleton instance
 * Used in services & hooks
 */
export const activityService = new ActivityService();
