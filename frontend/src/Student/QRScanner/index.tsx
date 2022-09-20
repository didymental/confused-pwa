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
  NavContext,
} from "@ionic/react";
import { camera, person, resizeOutline, scan } from "ionicons/icons";
import "../join-page.scss";
import { useState, useEffect, useContext } from "react";
import QrScanner from "qr-scanner";
import { useSessionCode } from "../../hooks/joinsession/useSessionCode";
import { useHistory } from "react-router-dom";

const Scanner: React.FC = (props) => {
  const { goBack } = useContext(NavContext);
  const [iserror, setIserror] = useState<boolean>(false);
  const { sessionCode, setSessionCode } = useSessionCode();

  let qrScanner: QrScanner | undefined = undefined;

  //Create scanner and start scanning on page load. No rerenders otherwise
  useEffect(() => {
    const video = document.getElementById("qr-video") as HTMLVideoElement;
    let scanResult;
    if (qrScanner == undefined) {
      qrScanner = new QrScanner(
        video,
        (result) => {
          setSessionCode(result.data);
          goBack();
        },
        {
          returnDetailedScanResult: true,
        },
      );
    }

    qrScanner.start();

    console.log(sessionCode);

    //Cleanup function to unload the qrScanner
    return () => {
      if (qrScanner != undefined) {
        qrScanner.destroy();
        qrScanner = undefined;
      }
    };
  }, []);

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
                message={"message"}
                buttons={["Dismiss"]}
              />
            </IonCol>
          </IonRow>
          <video id="qr-video" className="join-page__qr-scan-box"></video>
          <IonRow>
            <IonCol>{sessionCode}</IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
