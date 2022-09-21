import { AxiosResponse } from "axios";
import { SessionsEntity, SessionEntity, CreateSessionRequest } from "../types/session";
import client from "./client";

export async function getSessions(): Promise<AxiosResponse<SessionsEntity>> {
  return client.get("/sessions/");
}

export async function createSession(
  data: CreateSessionRequest,
): Promise<AxiosResponse<SessionEntity>> {
  return client.post("/sessions/", data);
}

export async function updateSession(data: SessionEntity): Promise<AxiosResponse<SessionEntity>> {
  const session_id = data.id;
  return client.put(`/sessions/${session_id}/`, data);
}

export async function deleteSession(session_id: number): Promise<AxiosResponse<void>> {
  return client.delete(`/sessions/${session_id}/`);
}
