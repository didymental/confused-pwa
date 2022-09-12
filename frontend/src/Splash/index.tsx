import { IonButton, IonButtons, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import "./index.css";
import logo from "../logo-light.svg";

const Splash: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="splash">
        <div className="page">
          <IonGrid>
            <IonRow className="grid__row">
              <img src={logo} className="logo" alt="logo" />
            </IonRow>
            <IonRow className="grid__row">
              <p>Confused? You don&apos;t have to be!</p>
            </IonRow>
            <IonRow className="grid__row">
              <p>Get started</p>
            </IonRow>
            <IonRow className="grid__row">
              <IonButtons>
                <IonButton color="primary" onClick={() => {}}>
                  Instructor
                </IonButton>
              </IonButtons>
            </IonRow>
            <IonRow className="grid__row">
              <IonButton color="primary" onClick={() => {}}>
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
