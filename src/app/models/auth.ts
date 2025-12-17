export interface AuthRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  message: string;
  token: string;
}
