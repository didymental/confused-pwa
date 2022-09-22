import { useEffect } from "react";
import api from "../../api";
import { getSessions } from "../../api/session";
import { EDIT_PROFILE_DATA_ID, getUser, setUser } from "../../localStorage";
import { ProfileData, PutProfileData } from "../../types/profiles";
import useAnalyticsTracker from "../util/useAnalyticsTracker";
import { useOnlineStatus } from "../util/useOnlineStatus";
import { useToast } from "../util/useToast";

interface UpdateAuthenticationState {
  editProfile: (id: string, data: PutProfileData) => Promise<void>;
  sendSavedProfileData: () => void;
}

export const useProfile = (isOnline = true): UpdateAuthenticationState => {
  const { presentToast } = useToast();
  const profileAnalyticsTracker = useAnalyticsTracker("Profile");
  const user = getUser();

  const editProfile = async (id: string, data: PutProfileData, reconnected = false) => {
    try {
      let profileData: ProfileData;
      if (!isOnline) {
        localStorage.setItem(EDIT_PROFILE_DATA_ID, JSON.stringify(data));
        profileData = {
          id: user?.id ?? "",
          email: user?.email ?? "",
          ...data,
        };
      } else {
        const response = await api.profile.updateProfile(id, data);
        profileData = response.data;
        profileAnalyticsTracker("Updated nickname");
      }

      setUser(profileData);

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
  const sendSavedProfileData = () => {
    if (localStorage.getItem(EDIT_PROFILE_DATA_ID)) {
      editProfile(
        user!.id,
        JSON.parse(localStorage.getItem(EDIT_PROFILE_DATA_ID) ?? ""),
        true,
      ).then(() => localStorage.removeItem(EDIT_PROFILE_DATA_ID));
    }
  };

  return {
    editProfile,
    sendSavedProfileData,
  };
};
