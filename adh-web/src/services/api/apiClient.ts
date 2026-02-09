import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const apiError: ApiError = {
        status: error.response.status,
        code: error.response.data?.code ?? 'UNKNOWN',
        message: error.response.data?.message ?? error.message,
      };
      return Promise.reject(apiError);
    }
    if (!navigator.onLine) {
      return Promise.reject({
        status: 0,
        code: 'OFFLINE',
        message: 'No network connection',
      });
    }
    return Promise.reject({
      status: 0,
      code: 'NETWORK_ERROR',
      message: error.message,
    });
  },
);

export { apiClient };
