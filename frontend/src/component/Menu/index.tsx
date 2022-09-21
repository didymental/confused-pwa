import "./index.scss";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItemDivider,
  IonPopover,
  IonRow,
  IonText,
  useIonAlert,
} from "@ionic/react";
import { personOutline, logOutOutline, createOutline, mailOutline } from "ionicons/icons";
import { useToast } from "../../hooks/util/useToast";
import { useAuthentication } from "../../hooks/authentication/useAuthentication";
import { useProfile } from "../../hooks/authentication/useProfile";
import { ProfileData } from "../../types/profiles";

interface MenuProps {
  user: ProfileData;
}

const Menu: React.FC<MenuProps> = ({ user }) => {
  const { id: userId, name, email } = user;
  const [presentAlert] = useIonAlert();
  const { presentToast } = useToast();
  const { logout } = useAuthentication();
  const { editProfile } = useProfile();

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
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Done",
          handler: (value) => {
            const name = value?.name;
            if (name) {
              editProfile(userId, { name: name });
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

  return (
    <IonPopover dismiss-on-select trigger={"menu-button"} triggerAction="click">
      <IonItemDivider color="dark-purple">Your Profile</IonItemDivider>
      <IonGrid>
        <IonRow className="menu__row">
          <IonCol size="2">
            <IonIcon className="menu__icon" icon={personOutline} color="medium"></IonIcon>
          </IonCol>
          <IonCol size="10">
            <IonText color="medium">{name}</IonText>
          </IonCol>
        </IonRow>
        <IonRow className="menu__row">
          <IonCol size="2">
            <IonIcon className="menu__icon" icon={mailOutline} color="medium"></IonIcon>
          </IonCol>
          <IonCol size="10">
            <IonText color="medium">{email}</IonText>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonItemDivider color="dark-purple">Settings</IonItemDivider>
      <IonGrid>
        <IonRow className="menu__button">
          <IonButton fill="clear" onClick={handleChangeName}>
            <IonIcon slot="start" icon={createOutline} />
            Edit nickname
          </IonButton>
        </IonRow>
        <IonRow className="menu__button">
          <IonButton fill="clear" onClick={logout}>
            <IonIcon slot="start" icon={logOutOutline} />
            Log out
          </IonButton>
        </IonRow>
      </IonGrid>
    </IonPopover>
  );
};

export default Menu;
