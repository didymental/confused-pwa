import { AxiosResponse } from "axios";
import { JoinSessionRequest, JoinSessionResponse } from "../types/join";
import studentClient from "./studentClient";

export async function joinSession(
  data: JoinSessionRequest,
): Promise<AxiosResponse<JoinSessionResponse>> {
  return studentClient.post("/students/", data);
}
