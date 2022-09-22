import * as constants from "./constants";
import * as auth from "./auth";
import * as localSessions from "./localSessions";
import * as profileRequests from "./profileRequests";
import * as sessionRequests from "./sessionRequests";

const localStorage = {
  constants,
  auth,
  localSessions,
  profileRequests,
  sessionRequests,
};

export default localStorage;
