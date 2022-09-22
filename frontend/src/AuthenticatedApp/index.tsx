import { IonRouterOutlet } from "@ionic/react";
import { Route, Switch } from "react-router-dom";
import DashboardPage from "../Instructor/Dashboard";
import SessionFormPage from "../Instructor/SessionForm";
import { useAuthenticationRefresh } from "../hooks/authentication/useAuthentication";
import NotFoundPage from "../NotFound";
import Splash from "../Splash";
import LoginPage from "../Instructor/Auth/Login";
import SignUpPage from "../Instructor/Auth/SignUp";
import JoinPage from "../Student/JoinSession";
import Scanner from "../Student/QRScanner";
import StudentSessionPage from "../Student/Session";
import InstructorSessionPage from "../Instructor/Session";

const AuthenticatedApp: React.FC = () => {
  useAuthenticationRefresh();

  return (
    <IonRouterOutlet>
      <Switch>
        <Route path="/" exact component={Splash} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/signup" exact component={SignUpPage} />
        <Route path="/instructor/dashboard" component={DashboardPage} />
        <Route path="/instructor/session/create" exact component={SessionFormPage} />
        <Route path="/instructor/session/edit" exact component={SessionFormPage} />
        <Route path="/instructor/session/:id" exact component={InstructorSessionPage} />
        <Route path="/student" exact component={JoinPage} />
        <Route path="/student/scanner" exact component={Scanner} />
        <Route path="/student/session" exact component={StudentSessionPage} />
        <Route path="/student/session/:id" exact component={JoinPage} />
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </IonRouterOutlet>
  );
};

export default AuthenticatedApp;
