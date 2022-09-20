import "./index.scss";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { RecoilRoot } from "recoil";
import AuthenticatedApp from "../AuthenticatedApp";
import UnauthenticatedApp from "../UnauthenticatedApp";
import { getUser } from "../localStorage";
import ReactGA from "react-ga";
import { useEffect } from "react";

const TRACKING_ID = "UA-XXXXX-X";

ReactGA.initialize(TRACKING_ID);

const ActiveApp: React.FC = () => {
  const user = getUser();
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
