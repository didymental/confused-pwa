import "./index.scss";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useProfile } from "../../hooks/authentication/useProfile";
import localStorage from "../../localStorage";
import { useOnlineStatus } from "../../hooks/util/useOnlineStatus";
import { personCircleOutline } from "ionicons/icons";
import { useEffect } from "react";

import Menu from "../Menu";

interface NavbarProps {
  title?: string;
  showProfileIcon?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { title = "", showProfileIcon = false, showBackButton = false, showLogo = false } = props;
  const location = useLocation();
  const user = localStorage.auth.getUser();
  const isOnline = useOnlineStatus();
  const { sendProfileSavedData } = useProfile(isOnline);

  useEffect(() => {
    if (isOnline) {
      sendProfileSavedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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
        <IonGrid>
          <IonRow>
            {showLogo && <img src={logo} alt="logo" className="navbar navbar__logo" />}
            <h2 className="navbar navbar__title">{title}</h2>
          </IonRow>
        </IonGrid>

        {showProfileIcon && (
          <>
            <IonButtons slot="end">
              <IonButton id="menu-button">
                <IonIcon
                  className="navbar__menu-icon"
                  color="primary"
                  icon={personCircleOutline}
                ></IonIcon>
              </IonButton>
            </IonButtons>
            <Menu user={user} />
          </>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Navbar;
