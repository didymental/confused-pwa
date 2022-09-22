import { PutProfileData } from "./profiles";
import { CreateSessionRequest, SessionEntity } from "./session";

export enum RequestType {
  CREATE,
  UPDATE,
  DELETE,
}

interface OfflineRequest {
  type: RequestType;
  param?: any;
  body?: any;
}

export interface OfflineSessionRequest extends OfflineRequest {
  type: RequestType;
  param?: number;
  id?: number;
  body?: SessionEntity | CreateSessionRequest;
}

export interface OfflineProfileRequest extends OfflineRequest {
  type: RequestType;
  body: PutProfileData;
}
