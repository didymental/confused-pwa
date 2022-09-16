export const CONFUSED_PREFIX = "confused/";
export const ACCESS_TOKEN = `${CONFUSED_PREFIX} ACCESS_TOKEN`;

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
