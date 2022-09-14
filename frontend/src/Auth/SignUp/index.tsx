import { IonContent, IonPage } from "@ionic/react";
import Navbar from "../../component/Navbar";
import "./index.scss";

const SignUpPage: React.FC = () => {
  return (
    <IonPage>
      <Navbar title={"Sign up"} />
      <IonContent>
        <p>This is the sign up page.</p>
      </IonContent>
    </IonPage>
  );
};

export default SignUpPage;
