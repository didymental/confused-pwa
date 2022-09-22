import api from "../../api";
import localStorage from "../../localStorage";
import { RequestType } from "../../types/offlineRequests";
import { ProfileData, PutProfileData } from "../../types/profiles";
import useAnalyticsTracker from "../util/useAnalyticsTracker";
import { useToast } from "../util/useToast";

interface UpdateAuthenticationState {
  editProfile: (id: string, data: PutProfileData) => Promise<void>;
  sendProfileSavedData: () => void;
}

export const useProfile = (isOnline = true): UpdateAuthenticationState => {
  const { presentToast } = useToast();
  const profileAnalyticsTracker = useAnalyticsTracker("Profile");
  const user = localStorage.auth.getUser();

  const editProfile = async (id: string, data: PutProfileData, reconnected = false) => {
    try {
      let profileData: ProfileData;
      if (isOnline) {
        const response = await api.profile.updateProfile(id, data);
        profileData = response.data;
        profileAnalyticsTracker("Updated nickname");
      } else {
        localStorage.profileRequests.setOfflineProfileRequest({
          type: RequestType.UPDATE,
          body: data,
        });

        profileData = {
          id: user?.id ?? "",
          email: user?.email ?? "",
          ...data,
        };
      }

      localStorage.auth.setUser(profileData);

      if (!reconnected) {
        presentToast({ header: "Update nickname success!", color: "success" });
      }
    } catch (err: any) {
      presentToast({
        header: "Nickname edit failed!",
        color: "danger",
      });
    }
  };

  //executes when internet is offline
  // sends the locally stored data into the end point when stores it in DB
  // once stored, removes it from local storage
  const sendProfileSavedData = async () => {
    const request = localStorage.profileRequests.getOfflineProfileRequest();
    if (!request) {
      return;
    }
    const isReconnected = true;
    const { body } = request;
    await editProfile(user!.id, body as PutProfileData, isReconnected);
    localStorage.profileRequests.setOfflineProfileRequest(null);
  };

  return {
    editProfile,
    sendProfileSavedData,
  };
};
