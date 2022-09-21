import { ProfileData } from "../types/profiles";

export const CONFUSED_PREFIX = "confused/";
export const ACCESS_TOKEN = `${CONFUSED_PREFIX} ACCESS_TOKEN`;
export const REFRESH_TOKEN = `${CONFUSED_PREFIX} REFRESH_TOKEN`;
export const USER_ID = `${CONFUSED_PREFIX} USER_ID`;
export const USER_EMAIL = `${CONFUSED_PREFIX} USER_EMAIL`;
export const USER_NAME = `${CONFUSED_PREFIX} USER_NAME`;
export const STORAGE_EVENT = "STORAGE_EVENT";

export const CREATE_SESSION_DATA_ID = `${CONFUSED_PREFIX} CREATE_SESSION`;
export const EDIT_SESSION_DATA_ID = `${CONFUSED_PREFIX} EDIT_SESSION`;
export const EDIT_PROFILE_DATA_ID = `${CONFUSED_PREFIX} EDIT_PROFILE`;

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function setAccessToken(token: string | null): void {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN);
  }
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN);
}

export function setRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN);
  }
}

export function getUser(): ProfileData | null {
  const id = localStorage.getItem(USER_ID);
  const email = localStorage.getItem(USER_EMAIL);
  const name = localStorage.getItem(USER_NAME);
  if (!id || !email || !name) {
    return null;
  }

  return { id, email, name };
}

export function setUser(data: ProfileData | null): void {
  if (data) {
    localStorage.setItem(USER_ID, data.id);
    localStorage.setItem(USER_EMAIL, data.email);
    localStorage.setItem(USER_NAME, data.name);
  } else {
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(USER_EMAIL);
    localStorage.removeItem(USER_NAME);
  }
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

// export function getSessions(): SessionEntity[] | null {
//   const id = localStorage.getItem(SESSION_ID);
//   const email = localStorage.getItem(USER_EMAIL);
//   const name = localStorage.getItem(USER_NAME);
//   if (!id || !email || !name) {
//     return null;
//   }

//   return { id, email, name };
// }

// // id: number;
// // instructor: string;
// // name: string;
// // is_open: boolean;
// // created_date_time?: string;
// export function setSessions(data: SessionEntity[] | null): void {
//   if (data) {
//     localStorage.setItem(USER_ID, data.id);
//     localStorage.setItem(USER_EMAIL, data.email);
//     localStorage.setItem(USER_NAME, data.name);
//   } else {
//     localStorage.removeItem(USER_ID);
//     localStorage.removeItem(USER_EMAIL);
//     localStorage.removeItem(USER_NAME);
//   }
//   window.dispatchEvent(new Event(STORAGE_EVENT));
// }
