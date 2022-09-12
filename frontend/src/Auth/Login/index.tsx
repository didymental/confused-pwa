import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Log In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>This is the login page.</p>
      </IonContent>
    </IonPage>
  );
};

export default Login;
