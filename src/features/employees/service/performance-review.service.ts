import { BaseApiClient } from '@/services/base/BaseApiClient';
import type { PerformanceReview, UpdatePerformanceReviewRequest } from '../types';

/**
 * Performance Review Service
 * Manages all API calls for performance review functionality
 */
export class PerformanceReviewService extends BaseApiClient {
  constructor() {
    super('/performance-reviews');
  }

  /**
   * PUT /performance-reviews/{reviewId}
   * Update a performance review
   *
   * @param id - Performance Review ID
   * @param data - Updated review data
   * @returns Updated PerformanceReview
   */
  async update(id: string, data: UpdatePerformanceReviewRequest): Promise<PerformanceReview> {
    return this.PUT<PerformanceReview>(`/${id}`, data);
  }

  /**
   * DELETE /performance-reviews/{reviewId}
   * Delete a performance review (Admin only)
   *
   * @param id - Performance Review ID
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
export const performanceReviewService = new PerformanceReviewService();
