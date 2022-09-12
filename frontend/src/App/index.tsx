import "./index.css";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import Login from "../Auth/Login";
import Splash from "../Splash";
import SignUp from "../Auth/SignUp";

function App() {
  setupIonicReact();
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact component={Splash} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
