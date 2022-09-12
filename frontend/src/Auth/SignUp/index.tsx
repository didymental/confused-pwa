import { IonContent, IonGrid, IonHeader, IonPage, IonRow, IonToolbar } from "@ionic/react";
import logo from "../../Assets/logo.svg";
import "./index.scss";

const SignUpPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <img src={logo} alt="logo" className="navbar navbar__logo" />
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>This is the sign up page.</p>
      </IonContent>
    </IonPage>
  );
};

export default SignUpPage;
