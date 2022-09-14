import { IonButton, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import "./index.scss";
import logo from "../Assets/logo-light.svg";
import { useHistory } from "react-router";

const Splash: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent className="splash">
        <div className="page">
          <IonGrid>
            <IonRow className="grid__row">
              <img src={logo} className="logo" alt="logo" />
            </IonRow>
            <IonRow className="grid__row">
              <h2>Confused? You don&apos;t have to be!</h2>
            </IonRow>
            <IonRow className="grid__row">
              <p>Get started as a</p>
            </IonRow>
            <IonRow className="grid__row">
              <IonButton
                color="secondary"
                onClick={() => {
                  history.push("/login");
                }}
              >
                Instructor
              </IonButton>
            </IonRow>
            <IonRow className="grid__row">
              <p>or</p>
            </IonRow>
            <IonRow className="grid__row">
              <IonButton
                color="secondary"
                onClick={() => {
                  history.push("/join");
                }}
              >
                Student
              </IonButton>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
