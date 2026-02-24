// frontend/src/types/api.ts
export interface ApiError {
  message: string;
  field?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}