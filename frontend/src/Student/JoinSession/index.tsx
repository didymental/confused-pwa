import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
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
  getPlatforms,
  useIonToast,
} from "@ionic/react";
import { camera, person, resizeOutline, scan } from "ionicons/icons";
import "../join-page.scss";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logo from "../../assets/logo-light.svg";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useToast } from "../../hooks/util/useToast";
import { useSessionCode } from "../../hooks/joinsession/useSessionCode";
import { useStudentName } from "../../hooks/joinsession/useStudentName";

const JoinPage: React.FC = () => {
  const { sessionCode, setSessionCode } = useSessionCode();
  const { studentName, setStudentName } = useStudentName();

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [present] = useIonToast();

  const history = useHistory();

  const invalidPINMsg: string = "Please enter a valid session code";
  const sessionNotFoundMsg: string = "Session not found";
  const unknownErrorMsg: string = "error. Please contact administrators for more details";

  const displayToast = (message: string[] | string | undefined) => {
    let messageString;
    if (message === undefined) {
      messageString = "Undefined message";
    } else if (Array.isArray(message)) {
      messageString = message.toString();
    } else {
      messageString = message;
    }

    present({
      message: messageString,
      duration: 1500,
      position: "bottom",
    });
  };

  const handleJoinSession = () => {
    if (sessionCode === "") {
      setMessage(invalidPINMsg);
      setIserror(true);
      return;
    }

    const api = axios.create({
      baseURL: "https://reqres.in/api/",
    });

    let resStatus: number = 0;
    if (sessionCode === "VALIDCODE") {
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

  const scanQR = () => {
    return;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="join-page__container splash">
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
                  value={sessionCode}
                  placeholder={"1234"}
                  onIonChange={(e) => setSessionCode(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="floating">Display Name</IonLabel>
                <IonInput
                  type="text"
                  value={studentName}
                  placeholder={"John Doe"}
                  onIonChange={(e) => setStudentName(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <p
                className="
                join-page__auxilliary-text--medium
                join-page__auxilliary-text--translucent
              "
              >
                This name will be displayed to your instructor. You can&apos;t change this name
                later.
              </p>
              <IonButton
                color="secondary"
                size="default"
                expand="block"
                onClick={handleJoinSession}
              >
                Join Session
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color="secondary" routerLink="/scanner">
            <IonIcon icon={scan} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default JoinPage;
