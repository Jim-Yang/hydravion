import { FPListContentResponse } from '../types/FPListContentResponse';
import { FPVideoResponse } from '../types/FPVideoResponse';
import { FPListResponse } from '../types/FPListResponse';

// Define parameter interfaces
export interface GetCreatorContentParams {
  id: string;
  limit: number;
  fetchAfter: number;
  search?: string;
  sort?: 'DESC' | 'ASC';
  hasVideo?: boolean;
  hasAudio?: boolean;
  hasPicture?: boolean;
  hasText?: boolean;
}

export interface GetVideoDeliveryParams {
  guid: string;
}

export class FPAPIClient {
  private baseUrl: string = 'https://www.floatplane.com';
  private cookie: string;

  constructor(cookie: string) {
    this.cookie = cookie;
  }

  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.cookie,
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get notification channel list
   */
  async getNotificationChannels(): Promise<FPListResponse> {
    return this.get<FPListResponse>('/api/v3/user/notification/channels/list');
  }

  /**
   * Get creator content list with filters
   */
  async getCreatorContent(params: GetCreatorContentParams): Promise<FPListContentResponse> {
    const queryParams = new URLSearchParams({
      id: params.id,
      limit: params.limit.toString(),
      fetchAfter: params.fetchAfter.toString(),
      search: params.search || '',
      sort: params.sort || 'DESC',
      hasVideo: (params.hasVideo ?? false).toString(),
      hasAudio: (params.hasAudio ?? false).toString(),
      hasPicture: (params.hasPicture ?? false).toString(),
      hasText: (params.hasText ?? false).toString(),
    });

    return this.get<FPListContentResponse>(`/api/v3/content/creator?${queryParams}`);
  }

  /**
   * Get video delivery information
   */
  async getVideoDelivery(params: GetVideoDeliveryParams): Promise<FPVideoResponse> {
    const queryParams = new URLSearchParams({
      type: 'vod',
      guid: params.guid,
    });

    return this.get<FPVideoResponse>(`/api/v2/cdn/delivery?${queryParams}`);
  }
}
