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
} from "@ionic/react";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../../../component/Navbar";
import "./index.scss";
import ConfusedIcon from "../../../component/ConfusedIcon";

function validateEmail(email: string) {
  const re =
    // eslint-disable-next-line no-control-regex
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

const SignUpPage: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("eve.holt@reqres.in");
  const [password, setPassword] = useState<string>("cityslicka");
  const [displayName, setDisplayName] = useState<string>("ailing35");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const handleSignUp = () => {
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

    const signUpData = {
      email: email,
      password: password,
      displayName: displayName,
    };

    // TODO
    const api = axios.create({
      baseURL: "https://reqres.in/api",
    });
    api
      .post("/signup", signUpData)
      .then((res) => {
        history.push(`/instructor/dashboard?email=${email}`);
      })
      .catch((error) => {
        setMessage("Auth failure! Please retry");
        setIserror(true);
      });
  };
  // TODO
  return (
    <IonPage>
      <Navbar title={"Confused"} />
      <IonContent fullscreen className="signup-form__container">
        <IonGrid className="signup-form__content">
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass="my-custom-class"
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

          <IonRow>
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="stacked"> Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow className="signup-form__field">
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="stacked"> Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow className="signup-form__field">
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="stacked"> Display Name</IonLabel>
                <IonInput
                  type="text"
                  value={displayName}
                  onIonChange={(e) => setDisplayName(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <p className="signup-form__auxilliary-text--small">
                By clicking SIGN UP you agree to our <a href="/">Policy</a>
              </p>
              <IonButton expand="block" onClick={handleSignUp}>
                Sign up
              </IonButton>
              <p className="signup-form__auxilliary-text--middle">
                Have an account? <a href="/login">Log in!</a>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignUpPage;
