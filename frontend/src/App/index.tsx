import "./index.scss";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { RecoilRoot } from "recoil";
import AuthenticatedApp from "../AuthenticatedApp";
import UnauthenticatedApp from "../UnauthenticatedApp";
import { getUser, STORAGE_EVENT } from "../localStorage";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";

const TRACKING_ID = "UA-241949846-1";

ReactGA.initialize(TRACKING_ID);

const ActiveApp: React.FC = () => {
  const [user, setUser] = useState(getUser());

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

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

function App() {
  setupIonicReact();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <RecoilRoot>
      <IonApp>
        <IonReactRouter>
          <ActiveApp />
        </IonReactRouter>
      </IonApp>
    </RecoilRoot>
  );
}

export default App;
