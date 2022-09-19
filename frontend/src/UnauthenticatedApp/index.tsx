import { IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router-dom";
import LoginPage from "../Instructor/Auth/Login";
import Splash from "../Splash";
import SignUpPage from "../Instructor/Auth/SignUp";
import JoinPage from "../Student/JoinSession";
import StudentSessionPage from "../Student/Session";
import NotFoundPage from "../NotFound";

const UnauthenticatedApp: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="/" exact component={Splash} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/signup" exact component={SignUpPage} />
      <Route path="/student" exact component={JoinPage} />
      <Route path="/student/session/:id" exact component={StudentSessionPage} />
      <Route>
        <NotFoundPage />
      </Route>
    </IonRouterOutlet>
  );
};

export default UnauthenticatedApp;
