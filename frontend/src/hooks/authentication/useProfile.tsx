import api from "../../api";
import { setUser } from "../../localStorage";
import { PutProfileData } from "../../types/profiles";
import useAnalyticsTracker from "../util/useAnalyticsTracker";
import { useToast } from "../util/useToast";

interface UpdateAuthenticationState {
  editProfile: (id: string, data: PutProfileData) => Promise<void>;
}

export const useProfile = (): UpdateAuthenticationState => {
  const { presentToast } = useToast();
  const profileAnalyticsTracker = useAnalyticsTracker("Profile");

  const editProfile = async (id: string, data: PutProfileData) => {
    try {
      const response = await api.profile.updateProfile(id, data);
      const profileData = response.data;
      setUser(profileData);

      profileAnalyticsTracker("Updated nickname");
      presentToast({ header: "Update nickname success!", color: "success" });
    } catch (err: any) {
      presentToast({
        header: "Nickname edit failed!",
        color: "danger",
      });
    }
  };

  return {
    editProfile,
  };
};
