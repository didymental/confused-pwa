import { IonButton, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import "./index.scss";
import logo from "../assets/logo-light.svg";
import { useHistory } from "react-router";

const NotFoundPage: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent className="notfound">
        <div className="page">
          <IonGrid>
            <IonRow className="grid__row">
              <img src={logo} className="logo" alt="logo" onClick={() => history.push("/")} />
            </IonRow>
            <IonRow className="grid__row">
              <h1>404 Not Found</h1>
            </IonRow>
            <IonRow className="grid__row">
              <p>This page is not available.</p>
            </IonRow>
            <IonRow className="grid__row">
              <IonButton fill="outline" color="secondary" onClick={() => history.push("/")}>
                Go back to main page
              </IonButton>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFoundPage;
