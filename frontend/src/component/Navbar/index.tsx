import "./index.scss";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonPopover,
  IonRow,
  IonText,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { personCircle, logOutOutline, createOutline } from "ionicons/icons";
import { useToast } from "../../hooks/util/useToast";
import { useAuthentication } from "../../hooks/authentication/useAuthentication";
import { useProfile } from "../../hooks/authentication/useProfile";
import { getUser } from "../../localStorage";
import { useEffect, useState } from "react";
import { Detector } from "react-detect-offline";
import { getSessions } from "../../api/session";

interface NavbarProps {
  title?: string;
  showProfileIcon?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { title = "", showProfileIcon = false, showBackButton = false, showLogo = false } = props;
  const location = useLocation();
  const user = getUser();
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [presentAlert] = useIonAlert();
  const { presentToast } = useToast();
  const { logout } = useAuthentication();
  const { editProfile, sendSavedProfileData } = useProfile(isOnline);

  useEffect(() => {
    if (isOnline) {
      sendSavedProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const handleChangeName = () => {
    if (!user) {
      return;
    }
    presentAlert({
      header: "Enter your new nickname",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Done",
          handler: (value) => {
            const name = value?.name;
            if (name) {
              editProfile(user.id, { name: name });
              return;
            }
            presentToast({
              header: "Update nickname failed!",
              message: "Please key in your nickname.",
              color: "danger",
            });
          },
        },
      ],
      inputs: [
        {
          name: "name",
          type: "text",
          placeholder: "e.g. Doctor Apple",
          attributes: {
            minLength: 0,
          },
        },
      ],
    });
  };

  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    !user
  ) {
    return null;
  }
  return (
    <IonHeader>
      <IonToolbar>
        {showBackButton && (
          <IonButtons slot="start" className="navbar__back-button">
            <IonBackButton text="" />
          </IonButtons>
        )}
        <Detector
          render={({ online }) => {
            setIsOnline(online);
            return <></>;
          }}
        />
        <IonGrid>
          <IonRow>
            {showLogo && <img src={logo} alt="logo" className="navbar navbar__logo" />}
            <h2 className="navbar navbar__title">{title}</h2>
          </IonRow>
        </IonGrid>

        {showProfileIcon && (
          <>
            <IonButtons slot="end">
              <IonButton id="profile-button">
                <IonIcon
                  className="navbar__profile-icon"
                  color="primary"
                  icon={personCircle}
                ></IonIcon>
              </IonButton>
            </IonButtons>

            <IonPopover dismiss-on-select trigger={"profile-button"} triggerAction="click">
              <IonItem>
                <IonText className="profile-dropdown__name">{user.name}</IonText>
              </IonItem>
              <IonButton fill="clear" onClick={handleChangeName}>
                <IonIcon slot="start" icon={createOutline} />
                Edit nickname
              </IonButton>
              <IonButton fill="clear" onClick={logout}>
                <IonIcon slot="start" icon={logOutOutline} />
                Log out
              </IonButton>
            </IonPopover>
          </>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Navbar;
