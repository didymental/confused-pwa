import "./index.scss";
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
import { useEffect, useRef, useState } from "react";
import "./index.scss";
import ConfusedIcon from "../../../component/ConfusedIcon";
import Navbar from "../../../component/Navbar";
import { useAuthentication } from "../../../hooks/authentication/useAuthentication";
import { Link, Redirect } from "react-router-dom";
import { PolicyModal } from "../../../component/PolicyModal";

function validateEmail(email: string) {
  const re =
    // eslint-disable-next-line no-control-regex
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { user, signUp } = useAuthentication();
  const [present, dismiss] = useIonLoading();
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);
  const page = useRef(undefined);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  const handleSignUp = async () => {
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

    const signUpRequest = {
      email: email,
      password: password,
      name: displayName,
    };
    present({
      message: "Signing up",
    });
    await signUp(signUpRequest);
    dismiss();
  };

  if (user) {
    return <Redirect to="/instructor/dashboard" />;
  }
  return (
    <IonPage>
      <Navbar title={"Confused"} />
      <IonContent fullscreen className="signup-form__container">
        <IonGrid className="signup-form__grid">
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
                <IonLabel position="floating"> Email</IonLabel>
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
                <IonLabel position="floating"> Password</IonLabel>
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
                <IonLabel position="floating"> Display Name</IonLabel>
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
                By clicking Sign up, you agree to our{" "}
                <Link to="#" id="signup-form__open-modal">
                  Privacy Policy
                </Link>
              </p>
              <IonButton onClick={handleSignUp} className="signup-form__button">
                Sign up
              </IonButton>
              <p className="signup-form__auxilliary-text--middle">
                Have an account? <Link to="/login">Log in</Link>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
        <PolicyModal presentingElement={presentingElement} trigger={"signup-form__open-modal"} />
      </IonContent>
    </IonPage>
  );
};

export default SignUpPage;
