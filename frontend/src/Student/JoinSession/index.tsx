import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "../join-page.scss";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logo from "../../Assets/logo.svg";

const JoinPage: React.FC = () => {
  const [sessionPIN, setSessionPIN] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const history = useHistory();

  const invalidPINMsg: string = "Please enter a valid session code";
  const sessionNotFoundMsg: string = "Session not found";
  const unknownErrorMsg: string = "error. Please contact administrators for more details";

  const handleJoinSession = () => {
    if (!sessionPIN) {
      setMessage(invalidPINMsg);
      setIserror(true);
      return;
    }

    const api = axios.create({
      baseURL: "https://confused-backend-3216.herokuapp.com/api/",
    });
  
    let resStatus: number = 0;
    if (sessionPIN === "VALIDCODE") {
      //Simulating a valid session PIN
      api
        .get("/unknown/2")
        .then((res) => {
          console.log(res);
          resStatus = res.status;
          history.push("/student/join");
        })
        .catch((error) => {
          console.log(error);
          setMessage(error.message + unknownErrorMsg);
          setIserror(true);
        });
    } else {
      //Simulating session not found
      api
        .get("/unknown/23")
        .then((res) => {
          console.log(res);
          resStatus = res.status;
        })
        .catch((error) => {
          console.log(error);
          setMessage(sessionNotFoundMsg + ". " + invalidPINMsg);
          setIserror(true);
        });
    }
  };
  return (
    <IonPage>
      <IonContent fullscreen className="join-page__container">
        <IonGrid className="join-page__content">
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
          <IonRow>
            <IonCol>
              <img width="200em" src={logo} className="logo-noanim" alt="logo" />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="floating">Session Code</IonLabel>
                <IonInput
                  type="text"
                  value={sessionPIN}
                  placeholder={"1234"}
                  onIonChange={(e) => setSessionPIN(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton color="primary" expand="block" onClick={handleJoinSession}>
                Enter
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default JoinPage;
