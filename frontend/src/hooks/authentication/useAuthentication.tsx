import { atom, useRecoilState, useRecoilValue } from "recoil";
import { useHistory } from "react-router";
import { LoginRequest, SignUpRequest, SignUpResponse } from "../../types/auth";
import { ProfileData } from "../../types/profiles";
import api from "../../api";
import { setAccessToken } from "../../localStorage";
import { useToast } from "../util/useToast";

const authenticatedUserState = atom({
  key: "AUTHENTICATED_USER_ATOM",
  default: null as ProfileData | null,
});

export const useAuthenticatedUser = () => {
  const user = useRecoilValue(authenticatedUserState);
  return user;
};

const useAuthenticatedUserState = () => {
  const [user, setUser] = useRecoilState(authenticatedUserState);

  const setAuthenthicationData = (data: SignUpResponse) => {
    const { id, email, name, token } = data;
    setAccessToken(token);
    setUser({ id: id, email: email, name: name });
  };
  return {
    user,
    setUser,
    setAuthenthicationData,
  };
};

interface UpdateAuthenticationState {
  user: ProfileData | null;
  signUp: (signUpRequest: SignUpRequest) => Promise<void>;
  login: (loginRequest: LoginRequest) => Promise<void>;
}

export const useAuthentication = (): UpdateAuthenticationState => {
  const history = useHistory();
  const { user, setAuthenthicationData } = useAuthenticatedUserState();
  const { presentToast } = useToast();

  const signUp = async (signUpRequest: SignUpRequest) => {
    try {
      const response = await api.auth.signUp(signUpRequest);
      const { data } = response;
      console.log(data);
      setAuthenthicationData(data);
      history.push("/instructor/dashboard");
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
      setAuthenthicationData(data);
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

  return {
    user,
    signUp,
    login,
  };
};
