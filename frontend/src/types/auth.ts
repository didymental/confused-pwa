export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
