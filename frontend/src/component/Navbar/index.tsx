// import "./index.scss";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPopover,
  IonRow,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { personCircle, logOutOutline, createOutline } from "ionicons/icons";
import "./index.scss";
import { useToast } from "../../hooks/util/useToast";

interface NavbarProps {
  title?: string;
  showProfileIcon?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { title = "", showProfileIcon = false } = props;
  const location = useLocation();
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const { presentToast } = useToast();

  const handleChangeName = () => {
    console.log("in change name");
    presentAlert({
      header: "Enter your new nickname",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Done",
          handler: (value) => {
            const name = value?.name;
            if (name) {
              presentToast({ header: "Update nickname success!", color: "success" });
              return;
            }
            presentToast({
              header: "Update nickname failed!",
              message: "Please key in nickname.",
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

  const handleLogout = () => {};
  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup"
  ) {
    return null;
  }
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonGrid>
          <IonRow>
            <img
              src={logo}
              alt="logo"
              className="navbar navbar__logo"
              onClick={() => history.push("/")}
            />
            <h2 className="navbar navbar__title">{title}</h2>
          </IonRow>
        </IonGrid>
        {/* TODO: Check if user is logged in */}
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
              <IonButton fill="clear" onClick={handleChangeName}>
                <IonIcon slot="start" icon={createOutline} />
                Edit nickname
              </IonButton>
              <IonButton className="navbar__profile-menu" fill="clear" onClick={handleLogout}>
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
