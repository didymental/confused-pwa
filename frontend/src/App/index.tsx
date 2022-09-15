import "./index.scss";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import LoginPage from "../Auth/Login";
import Splash from "../Splash";
import SignUpPage from "../Auth/SignUp";
import JoinPage from "../Student/JoinSession";
import StudentSessionPage from "../Student/Session";
import JoinDetailPage from "../Student/SetDisplayName";

function App() {
  setupIonicReact();
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact component={Splash} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/signup" exact component={SignUpPage} />
          <Route path="/student" exact component={JoinPage} />
          <Route path="/student/session/:id" exact component={StudentSessionPage} />
          <Route path="/joinDetail" exact component={JoinDetailPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
