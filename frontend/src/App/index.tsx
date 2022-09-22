import "./index.scss";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { RecoilRoot } from "recoil";
import AuthenticatedApp from "../AuthenticatedApp";
import UnauthenticatedApp from "../UnauthenticatedApp";
import localStorage from "../localStorage";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { OnlineStatusProvider } from "../hooks/util/useOnlineStatus";

const ActiveApp: React.FC = () => {
  const [user, setUser] = useState(localStorage.auth.getUser());
  useEffect(() => {
    function checkUserData() {
      const user = localStorage.auth.getUser();
      setUser(user);
    }

    window.addEventListener(localStorage.constants.STORAGE_EVENT, checkUserData);

    return () => {
      window.removeEventListener(localStorage.constants.STORAGE_EVENT, checkUserData);
    };
  }, []);

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
