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
  useIonLoading,
} from "@ionic/react";
import { returnDownBack, scan } from "ionicons/icons";
import "../join-page.scss";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToast } from "../../hooks/util/useToast";
import { useSessionCode, useStudentName } from "../../hooks/joinsession/useJoinDetails";
import { useJoinSession } from "../../hooks/joinsession/useJoinSession";
import ConfusedIcon from "../../component/ConfusedIcon";
import { JoinSessionRequest } from "../../types/join";
import { join } from "path";

const JoinPage: React.FC = () => {
  const { sessionCode, setSessionCode } = useSessionCode();
  const { studentName, setStudentName } = useStudentName();
  const { joinSession } = useJoinSession();

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [shouldShowLoading, setShouldShowLoading] = useState<boolean>(false);

  const history = useHistory();

  const invalidPINMsg: string = "Session input should only contain numbers.";
  const invalidNameMsg: string = "Name should only contain alphabets, numbers and spaces";
  const sessionNotFoundMsg: string = "Session not found";
  const unknownErrorMsg: string = "error. Please contact administrators for more details";

  const isNumericalOnly = (input: string) => {
    const res = /^[0-9]+$/.exec(input);
    const valid = !!res;
    return valid;
  };

  const isNameValid = (name: string) => {
    const res = /^\s*(([A-Za-z0-9]|\d){1,}([-']| |))+[A-Za-z0-9]+\s*$/.exec(name);
    const valid = !!res;
    return valid;
  };

  const handleJoinSession = async () => {
    setSessionCode(sessionCode.trim());
    setStudentName(studentName.trim());

    if (!isNumericalOnly(sessionCode)) {
      setMessage(invalidPINMsg);
      setIserror(true);
      return;
    }

    if (!isNameValid(studentName)) {
      setMessage(invalidNameMsg);
      setIserror(true);
      return;
    }

    const joinRequest: JoinSessionRequest = {
      session: parseInt(sessionCode),
      display_name: studentName,
      reaction_type: null,
    };

    setShouldShowLoading(true);
    await joinSession(joinRequest);
    setShouldShowLoading(false);

    /* Dummy API call for debugging purposes */

    // const api = axios.create({
    //   baseURL: "https://reqres.in/api/",
    // });

    // let resStatus: number = 0;
    // if (sessionCode === "123456") {
    //   //Simulating a valid session PIN
    //   api
    //     .get("/unknown/2")
    //     .then((res) => {
    //       console.log(res);
    //       resStatus = res.status;
    //       history.push("/student/session/:id");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       setMessage(error.message + unknownErrorMsg);
    //       setIserror(true);
    //     });
    // } else {
    //   //Simulating session not found
    //   api
    //     .get("/unknown/23")
    //     .then((res) => {
    //       console.log(res);
    //       resStatus = res.status;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       setMessage(sessionNotFoundMsg);
    //       setIserror(true);
    //     });
    // }

    /* End of dummy API call for debugging purposes */
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
          <IonRow className="login-form__profile-icon">
            <IonCol>
              <ConfusedIcon useLightLogo={true} />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="stacked">Session Code</IonLabel>
                <IonInput
                  type="tel"
                  inputMode="tel"
                  maxlength={6}
                  value={sessionCode}
                  placeholder={"123456"}
                  onIonChange={(e) => setSessionCode(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="stacked">Display Name</IonLabel>
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

          <IonRow>
            <IonCol>
              <IonButton
                className="join-page__qr-button"
                color="secondary"
                shape="round"
                routerLink="/student/scanner"
              >
                <IonIcon icon={scan} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default JoinPage;
