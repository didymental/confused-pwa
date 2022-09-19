import { IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router-dom";
import DashboardPage from "../Instructor/Dashboard";
import SessionFormPage from "../Instructor/SessionForm";
import { useAuthenticationRefresh } from "../hooks/authentication/useAuthentication";
import NotFoundPage from "../NotFound";
import Splash from "../Splash";
import LoginPage from "../Instructor/Auth/Login";
import SignUpPage from "../Instructor/Auth/SignUp";

const AuthenticatedApp: React.FC = () => {
  useAuthenticationRefresh();

  return (
    <IonRouterOutlet>
      <Route path="/" exact component={Splash} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/signup" exact component={SignUpPage} />
      <Route path="/instructor/dashboard" component={DashboardPage} />
      <Route path="/instructor/session/create" component={SessionFormPage} />
      <Route path="/instructor/session/edit" component={SessionFormPage} />
      <Route>
        <NotFoundPage />
      </Route>
    </IonRouterOutlet>
  );
};

export default AuthenticatedApp;
