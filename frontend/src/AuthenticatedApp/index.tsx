import { IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router-dom";
import DashboardPage from "../Instructor/Dashboard";
import SessionFormPage from "../Instructor/SessionForm";
import { useAuthenticationRefresh } from "../hooks/authentication/useAuthentication";
import NotFoundPage from "../NotFound";

const AuthenticatedApp: React.FC = () => {
  useAuthenticationRefresh();

  return (
    <IonRouterOutlet>
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
