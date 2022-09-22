import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  useIonLoading,
} from "@ionic/react";
import { useState } from "react";
import Navbar from "../../../component/Navbar";
import "./index.scss";
import { useAuthentication } from "../../../hooks/authentication/useAuthentication";
import { LoginRequest } from "../../../types/auth";
import ConfusedIcon from "../../../component/ConfusedIcon";
import { Link, Redirect } from "react-router-dom";

function validateEmail(email: string) {
  const re =
    // eslint-disable-next-line no-control-regex
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { user, login } = useAuthentication();
  const [present, dismiss] = useIonLoading();

  const handleLogin = async () => {
    if (!email) {
      setMessage("Please enter a valid email");
      setIserror(true);
      return;
    }
    if (validateEmail(email) === false) {
      setMessage("Your email is invalid");
      setIserror(true);
      return;
    }

    if (!password || password.length < 6) {
      setMessage("Please enter your password");
      setIserror(true);
      return;
    }

    const loginRequest: LoginRequest = {
      email: email,
      password: password,
    };

    present({
      message: "Logging in",
    });
    await login(loginRequest);
    dismiss();
  };

  if (user) {
    return <Redirect to="/instructor/dashboard" />;
  }
  return (
    <IonPage>
      <Navbar title={"Confused"} />
      <IonContent fullscreen className="login-form__container">
        <IonGrid className="login-form__grid">
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                // cssClass="my-custom-class"
                header={"Error!"}
                message={message}
                buttons={["Dismiss"]}
              />
            </IonCol>
          </IonRow>
          <IonRow className="login-form__profile-icon">
            <IonCol>
              <ConfusedIcon />
            </IonCol>
          </IonRow>

          <IonRow className="login-form__field">
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="floating"> Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow className="login-form__field">
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="floating"> Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <p className="login-form__auxilliary-text--small">
                By clicking on Login, you agree to our <Link to="/">Policy</Link>
              </p>
              <IonButton onClick={handleLogin} className="login-form__button">
                Login
              </IonButton>
              <p className="login-form__auxilliary-text--middle">
                Do not have an account? <Link to="/signup">Sign up now</Link>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
