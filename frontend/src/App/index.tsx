import "./index.scss";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { RecoilRoot } from "recoil";
import { useAuthenticatedUser } from "../hooks/authentication/useAuthentication";
import AuthenticatedApp from "../AuthenticatedApp";
import UnauthenticatedApp from "../UnauthenticatedApp";

const ActiveApp: React.FC = () => {
  const user = useAuthenticatedUser();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

function App() {
  setupIonicReact();

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
