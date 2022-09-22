import { useHistory } from "react-router";
import { LoginRequest, SignUpRequest } from "../../types/auth";
import api from "../../api";
import localStorage from "../../localStorage";
import { useToast } from "../util/useToast";
import { useInterval } from "usehooks-ts";
import { sleep } from "../../utils/time";
import { ProfileData } from "../../types/profiles";
import useAnalyticsTracker from "../util/useAnalyticsTracker";
import { useSessions } from "../session/useSession";

const useAuthenticatedUserState = () => {
  const setAuthenthicationData = async (accessToken: string, refreshToken: string) => {
    localStorage.auth.setAccessToken(accessToken);
    localStorage.auth.setRefreshToken(refreshToken);

    const response = await api.profile.getProfiles();
    const { id, email, name } = response.data[0];

    localStorage.auth.setUser({ id: id, email: email, name: name });
  };

  const clearAuthenticationData = () => {
    localStorage.auth.setAccessToken(null);
    localStorage.auth.setRefreshToken(null);
    localStorage.auth.setUser(null);
  };

  return {
    setAuthenthicationData,
    clearAuthenticationData,
  };
};

interface UpdateAuthenticationState {
  user: ProfileData | null;
  signUp: (signUpRequest: SignUpRequest) => Promise<void>;
  login: (loginRequest: LoginRequest) => Promise<void>;
  loginWithAccessToken: () => Promise<void>;
  logout: () => void;
}

export const useAuthentication = (): UpdateAuthenticationState => {
  const user = localStorage.auth.getUser();
  const history = useHistory();
  const { setAuthenthicationData, clearAuthenticationData } = useAuthenticatedUserState();
  const { presentToast } = useToast();
  const userAnalyticsTracker = useAnalyticsTracker("User");

  const { createSampleSessions, getSessions } = useSessions(true);

  const signUp = async (signUpRequest: SignUpRequest) => {
    try {
      const signUpResponse = await api.auth.signUp(signUpRequest);
      const refreshTokenRequest = { refresh: signUpResponse.data.refresh };
      const loginResponse = await api.auth.refreshAccessToken(refreshTokenRequest);
      const { access, refresh } = loginResponse.data;
      await setAuthenthicationData(access, refresh);

      await createSampleSessions();
      await getSessions();
      await userAnalyticsTracker("Signed up");
      setTimeout(() => {
        history.push("/instructor/dashboard");
      }, 2000);
      presentToast({ header: "Sign up success!", color: "success" });
    } catch (err: any) {
      presentToast({
        header: "Sign up failed!",
        message: err.response.data.email,
        color: "danger",
      });
    }
  };

  const login = async (loginRequest: LoginRequest) => {
    try {
      const response = await api.auth.login(loginRequest);
      const { data } = response;
      const { access, refresh } = data;
      await setAuthenthicationData(access, refresh);

      userAnalyticsTracker("Logged in");
      history.push("/instructor/dashboard");
      presentToast({ header: "Login success!", color: "success" });
    } catch (err: any) {
      presentToast({
        header: "Login failed!",
        message: "Invalid email or password.",
        color: "danger",
      });
    }
  };

  const loginWithAccessToken = async () => {
    const refreshToken = localStorage.auth.getRefreshToken();
    try {
      if (!refreshToken) {
        throw Error();
      }
      const refreshTokenRequest = { refresh: refreshToken };
      const response = await api.auth.refreshAccessToken(refreshTokenRequest);
      const { access, refresh } = response.data;
      await setAuthenthicationData(access, refresh);

      userAnalyticsTracker("Logged in with refreshed token");
    } catch (err: any) {
      presentToast({
        header: "Login failed!",
        message: "The previous session expired or internet connection is poor.",
        color: "danger",
      });
    }
  };

  const logout = () => {
    clearAuthenticationData();
    userAnalyticsTracker("Logged out");
    history.push("/login");
    presentToast({ header: "Logout success!", color: "success" });
  };

  return {
    user,
    signUp,
    login,
    loginWithAccessToken,
    logout,
  };
};

export const useAuthenticationRefresh = () => {
  const { loginWithAccessToken, logout } = useAuthentication();

  const getNewAccessToken = async () => {
    if (!localStorage.auth.getUser()) {
      return;
    }
    const oneSecond = 1000; // ms
    for (let i = 0; i < 3; i++) {
      try {
        await loginWithAccessToken();
        return;
      } catch {
        const delay = Math.pow(3, i);
        await sleep(oneSecond * delay);
      }
    }
    await logout();
  };

  const fiveMinutes = 5 * 60 * 1000; // ms
  useInterval(getNewAccessToken, fiveMinutes);
};
