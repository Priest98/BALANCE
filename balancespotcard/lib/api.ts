const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'An error occurred',
      response.status,
      data,
    );
  }

  return data as T;
}

// ─── API Client ───────────────────────────────────────────────────────────────

export const api = {
  // Card types
  getCardTypes: () => request<CardType[]>('/card-types'),

  // Verification
  verify: (data: VerificationRequest) =>
    request<VerificationResponse>('/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getVerificationResult: (id: string) =>
    request<VerificationResult>(`/verification/${id}`),

  submitEmail: (id: string, email: string) =>
    request<{ success: boolean }>(`/verification/${id}/email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Health
  getHealth: () => request<HealthResponse>('/health'),
};

// ─── Admin API Client ─────────────────────────────────────────────────────────

export function createAdminApi(adminKey: string) {
  const adminHeaders = { 'X-Admin-Key': adminKey };

  return {
    getDashboard: () =>
      request<DashboardStats>('/admin/dashboard', { headers: adminHeaders }),

    getVerifications: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return request<PaginatedResponse<VerificationItem>>(`/admin/verifications?${qs}`, {
        headers: adminHeaders,
      });
    },

    getCardTypes: () =>
      request<CardType[]>('/admin/card-types', { headers: adminHeaders }),

    createCardType: (data: Partial<CardType>) =>
      request<CardType>('/admin/card-types', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: adminHeaders,
      }),

    updateCardType: (id: string, data: Partial<CardType>) =>
      request<CardType>(`/admin/card-types/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: adminHeaders,
      }),

    deleteCardType: (id: string) =>
      request<void>(`/admin/card-types/${id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      }),

    getLogs: (params?: { page?: number; limit?: number; action?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return request<PaginatedResponse<AuditLog>>(`/admin/logs?${qs}`, {
        headers: adminHeaders,
      });
    },

    getSettings: () =>
      request<Setting[]>('/admin/settings', { headers: adminHeaders }),

    updateSettings: (settings: { key: string; value: string }[]) =>
      request<Setting[]>('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({ settings }),
        headers: adminHeaders,
      }),

    getQueueStats: () =>
      request<QueueStats>('/admin/queue', { headers: adminHeaders }),

    retryFailed: () =>
      request<{ retried: number }>('/admin/queue/retry-failed', {
        method: 'POST',
        headers: adminHeaders,
      }),

    cleanJobs: () =>
      request<{ cleaned: boolean }>('/admin/queue/clean', {
        method: 'POST',
        headers: adminHeaders,
      }),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardType {
  id: string;
  name: string;
  brand: string;
  logo: string | null;
  active: boolean;
  createdAt: string;
}

export interface VerificationRequest {
  cardTypeId: string;
  currency: string;
  amount: number;
  cardCode: string;
  pin?: string;
}

export interface VerificationResponse {
  requestId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  duplicate: boolean;
}

export interface VerificationResult {
  requestId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  cardType: { name: string; brand: string; logo: string | null };
  currency: string;
  amount: number;
  createdAt: string;
  result: {
    valid: boolean;
    balance: number | null;
    currency: string;
    cardStatus: 'ACTIVE' | 'USED' | 'EXPIRED' | 'INVALID' | 'BLOCKED' | 'UNKNOWN';
    provider: string;
    verifiedAt: string;
  } | null;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  services: Record<string, string>;
}

export interface DashboardStats {
  totals: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    valid: number;
    validRate: number;
  };
  recentRequests: VerificationItem[];
  requestsByDay: Array<{ date: string; total: number; completed: number; failed: number }>;
}

export interface VerificationItem {
  id: string;
  cardType: { name: string; brand: string };
  currency: string;
  amount: number;
  status: string;
  createdAt: string;
  verificationResult: { valid: boolean; balance: number | null; cardStatus: string } | null;
}

export interface AuditLog {
  id: string;
  action: string;
  requestId: string | null;
  ip: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface QueueStats {
  stats: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  jobs: {
    active: unknown[];
    completed: unknown[];
    failed: unknown[];
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
