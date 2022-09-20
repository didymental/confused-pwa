export interface SessionsEntity {
  count: number;
  next: number;
  previous: number;
  results: SessionEntity[];
}

export interface SessionEntity {
  id: number;
  instructor: string;
  name: string;
  is_open: boolean;
  created_date_time?: string;
}

export interface CreateSessionRequest {
  name: string;
  is_open: boolean;
}
