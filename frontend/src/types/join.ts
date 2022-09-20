export interface JoinSessionRequest {
  display_name: string;
  session: number;
  reaction_type: null;
}

export interface JoinSessionResponse {
  id: number;
  display_name: string;
  session: number;
  reaction_type: number | null;
}
