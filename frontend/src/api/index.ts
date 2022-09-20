import * as auth from "./auth";
import * as profile from "./profile";
import * as session from "./session";
import * as join from "./join";

const api = {
  auth,
  join,
  profile,
  session,
};

Object.freeze(api);

export default api;
