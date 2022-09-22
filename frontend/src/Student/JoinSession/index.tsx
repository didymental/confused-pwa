import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  useIonLoading,
} from "@ionic/react";
import { scan } from "ionicons/icons";
import "../join-page.scss";
import { useState, useEffect } from "react";
import { useSessionIdInput, useStudentName } from "../../hooks/joinsession/useJoinDetails";
import { useJoinSession } from "../../hooks/joinsession/useJoinSession";
import ConfusedIcon from "../../component/ConfusedIcon";
import { JoinSessionRequest } from "../../types/join";
import { useParams } from "react-router";

const JoinPage: React.FC = () => {
  const MAX_SESSION_PIN_LEN = 6;
  const MAX_STUDENT_NAME_LEN = 30;

  const { sessionIdInput, setSessionIdInput } = useSessionIdInput();
  const { studentName, setStudentName } = useStudentName();
  const { joinSession } = useJoinSession();

  const [present, dismiss] = useIonLoading();

  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { id }: any = useParams();

  const invalidPINMsg: string = "Session code should only contain numbers.";
  const invalidNameMsg: string =
    "Name should only contain alphabets, numbers and spaces, and cannot be empty";

  const isNumericalOnly = (input: string) => {
    //Check that input consists of one or more numerical digits
    const res = /^[0-9]+$/.exec(input);
    const valid = !!res;
    return valid;
  };

  const isNameValid = (name: string) => {
    const res = /^\s*(([A-Za-z0-9]){1,}([-']| |))+[A-Za-z0-9]*\s*$/.exec(name);
    const valid = !!res;
    return valid;
  };

  const handleJoinSession = async () => {
    setSessionIdInput(sessionIdInput.trim().substring(0, MAX_SESSION_PIN_LEN));
    setStudentName(studentName.trim().substring(0, MAX_STUDENT_NAME_LEN));

    if (!isNumericalOnly(sessionIdInput)) {
      setSessionIdInput("");
      setMessage(invalidPINMsg);
      setIsError(true);
      return;
    }

    if (!isNameValid(studentName)) {
      setMessage(invalidNameMsg);
      setIsError(true);
      return;
    }

    const joinRequest: JoinSessionRequest = {
      session: parseInt(sessionIdInput),
      display_name: studentName,
      reaction_type: null,
    };

    present({
      message: "Joining session...",
    });
    await joinSession(joinRequest);
    dismiss();
  };

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    setSessionIdInput(id);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen className="join-page__container">
        <IonGrid className="join-page__content">
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={isError}
                onDidDismiss={() => setIsError(false)}
                header={"Error!"}
                message={message}
                buttons={["Dismiss"]}
              />
            </IonCol>
          </IonRow>
          <IonRow className="login-form__icon">
            <IonCol>
              <ConfusedIcon useLightLogo={true} />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem fill="outline" className="join-page__input">
                <IonLabel position="stacked">Session Code</IonLabel>
                <IonInput
                  type="tel"
                  inputMode="tel"
                  maxlength={MAX_SESSION_PIN_LEN}
                  value={sessionIdInput}
                  placeholder={"123456"}
                  onIonChange={(e) => setSessionIdInput(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem fill="outline" className="join-page__input">
                <IonLabel position="stacked">Display Name</IonLabel>
                <IonInput
                  type="text"
                  maxlength={MAX_STUDENT_NAME_LEN}
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
