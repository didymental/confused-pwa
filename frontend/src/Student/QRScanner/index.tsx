import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
} from "@ionic/react";
import { close } from "ionicons/icons";
import "../join-page.scss";
import { useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import { useHistory, Redirect } from "react-router-dom";
import { useSessionIdInput } from "../../hooks/joinsession/useJoinDetails";

const Scanner: React.FC = (props) => {
  const { sessionIdInput, setSessionIdInput } = useSessionIdInput();
  const [shouldGoBack, setShouldGoBack] = useState(false);
  const [isQRScanned, setIsQRScanned] = useState(false);

  const history = useHistory();

  let [qrScanner, setQrScanner] = useState<QrScanner>();

  const extractSessionId = (qrData: string) => {
    // Match "/123" from "https://www.abc.com/student/session/123"
    // .match(string) returns an array
    const result = qrData.match(/[/]{1}[0-9]{1,6}[/]?$/);
    if (result === null) {
      setShouldGoBack(true);
      return "";
    }

    //Remove the "/" from the matched string
    return result[0].substring(1);
  };

  //Create scanner and start scanning on page load. No rerenders otherwise
  useEffect(() => {
    setShouldGoBack(false);

    /* Code to listt all available cameras
    const listCameras = async () => {
      const list = await QrScanner.listCameras();
      presentToast({
        header: "After list cameraS",
        message: list.toString(),
        color: "primary",
      });

      return list;
    };
    */

    const video = document.getElementById("qr-video") as HTMLVideoElement;
    if (qrScanner === undefined) {
      setQrScanner(
        new QrScanner(
          video,
          (result) => {
            let sessionIdFromQR = extractSessionId(result.data);
            setSessionIdInput(sessionIdFromQR);
            setIsQRScanned(true);
          },
          {
            returnDetailedScanResult: true,
          },
        ),
      );
    }

    if (qrScanner !== undefined) {
      qrScanner.setCamera("environment");

      qrScanner.start();
    }
    //Cleanup function to unload the qrScanner
    return () => {
      if (qrScanner !== undefined) {
        qrScanner.stop();
      }
    };
  }, [qrScanner, setSessionIdInput, setShouldGoBack]);

  return (
    <IonPage>
      <IonContent fullscreen className="join-page__container">
        <IonGrid className="join-page__container">
          <IonRow>
            <IonCol>
              <video id="qr-video" className="join-page__qr-scan-box"></video>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color="secondary" onClick={() => setShouldGoBack(true)}>
            <IonIcon icon={close} />
          </IonFabButton>
        </IonFab>
        {shouldGoBack ? <Redirect to="/student" /> : <></>}
        {isQRScanned ? <Redirect to={`/student/session/${sessionIdInput}`} /> : <></>}
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
