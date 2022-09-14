import "./index.scss";
import {
  IonApp,
  IonGrid,
  IonHeader,
  IonRouterOutlet,
  IonRow,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import LoginPage from "../Auth/Login";
import Splash from "../Splash";
import SignUpPage from "../Auth/SignUp";
import JoinPage from "../Student/JoinSession";
import logo from "../Assets/logo.svg";
import { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const location = useLocation();

  // useEffect(() => {

  //   console.log("Location changed");
  //   console.log(location);
  // }, [location]);

  if (location.pathname === "/") {
    return null;
  }
  return (
    <IonHeader>
      <IonToolbar>
        <IonGrid>
          <IonRow>
            <img src={logo} alt="logo" className="navbar navbar__logo" />
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonHeader>
  );
};

function App() {
  setupIonicReact();
  return (
    <IonApp>
      <IonReactRouter>
        <Navbar />
        <IonRouterOutlet>
          <Route path="/" exact component={Splash} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/signup" exact component={SignUpPage} />
          <Route path="/join" exact component={JoinPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
