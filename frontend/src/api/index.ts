import * as auth from "./auth";
import * as profile from "./profile";
import * as session from "./session";

const api = {
  auth,
  profile,
  session,
};

Object.freeze(api);

export default api;
