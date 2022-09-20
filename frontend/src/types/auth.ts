export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignUpResponse {
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export type RefreshTokenResponse = LoginResponse;
