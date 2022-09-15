import "./index.scss";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import LoginPage from "../Instructor/Auth/Login";
import Dashboard from "../Instructor/Dashboard";
import Splash from "../Splash";
import SignUpPage from "../Instructor/Auth/SignUp";
import JoinPage from "../Student/JoinSession";

function App() {
  setupIonicReact();
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact component={Splash} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/signup" exact component={SignUpPage} />
          <Route path="/join" exact component={JoinPage} />
          <Route path="/instructor/dashboard" component={Dashboard} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
