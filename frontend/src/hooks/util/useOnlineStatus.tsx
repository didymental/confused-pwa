import React, { useState, useEffect, useContext } from "react";
import { useToast } from "./useToast";

const OnlineStatusContext = React.createContext(navigator.onLine);

export const OnlineStatusProvider: React.FC<any> = ({ children }) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);
  const { presentToast } = useToast();
  const offlineListener = () => {
    if (onlineStatus) {
      presentToast({
        header: "You are offline now!",
        color: "danger",
      });
    }
    setOnlineStatus(false);
  };
  const onlineListener = () => {
    if (onlineStatus) {
      presentToast({
        header: "You are online now!",
        color: "success",
      });
    }
    setOnlineStatus(true);
  };

  useEffect(() => {
    window.addEventListener("offline", offlineListener);
    window.addEventListener("online", onlineListener);

    return () => {
      window.removeEventListener("offline", offlineListener);
      window.removeEventListener("online", onlineListener);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>{children}</OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};
