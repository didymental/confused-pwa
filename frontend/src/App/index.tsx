import "./index.scss";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import LoginPage from "../Instructor/Auth/Login";
import Splash from "../Splash";
import SignUpPage from "../Instructor/Auth/SignUp";
import JoinPage from "../Student/JoinSession";
import StudentSessionPage from "../Student/Session";
import JoinDetailPage from "../Student/SetDisplayName";
import DashboardPage from "../Instructor/Dashboard";
import Scanner from "../Student/QRScanner";
import { RecoilRoot } from "recoil";

function App() {
  setupIonicReact();
  return (
    <RecoilRoot>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact component={Splash} />
            <Route path="/login" exact component={LoginPage} />
            <Route path="/signup" exact component={SignUpPage} />
            <Route path="/student" exact component={JoinPage} />
            <Route path="/student/:id" exact component={JoinDetailPage} />
            <Route path="/student/session/:id" exact component={StudentSessionPage} />
            <Route path="/instructor/dashboard" component={DashboardPage} />
            <Route path="/scanner" component={Scanner} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </RecoilRoot>
  );
}

export default App;
