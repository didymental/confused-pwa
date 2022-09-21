import "./index.scss";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { RecoilRoot } from "recoil";
import AuthenticatedApp from "../AuthenticatedApp";
import UnauthenticatedApp from "../UnauthenticatedApp";
import { getUser, STORAGE_EVENT } from "../localStorage";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useOnlineStatus, OnlineStatusProvider } from "../hooks/util/useOnlineStatus";
import { useToast } from "../hooks/util/useToast";

const ActiveApp: React.FC = () => {
  const [user, setUser] = useState(getUser());
  const { presentToast } = useToast();
  const isOnline = useOnlineStatus();
  useEffect(() => {
    function checkUserData() {
      const user = getUser();
      setUser(user);
    }

    window.addEventListener(STORAGE_EVENT, checkUserData);

    return () => {
      window.removeEventListener(STORAGE_EVENT, checkUserData);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      presentToast({
        header: "You are offline now!",
        color: "danger",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

function App() {
  setupIonicReact();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
  }, []);

  return (
    <OnlineStatusProvider>
      <RecoilRoot>
        <IonApp>
          <IonReactRouter>
            <ActiveApp />
          </IonReactRouter>
        </IonApp>
      </RecoilRoot>
    </OnlineStatusProvider>
  );
}

export default App;
