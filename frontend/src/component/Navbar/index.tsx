// import "./index.scss";
import { IonGrid, IonHeader, IonRow, IonToolbar } from "@ionic/react";
import { useLocation } from "react-router-dom";
import logo from "../../Assets/logo.svg";

interface NavbarProps {
  title?: string;
}
const Navbar: React.FC<NavbarProps> = (props) => {
  const { title = "" } = props;
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }
  return (
    <IonHeader>
      <IonToolbar>
        <IonGrid>
          <IonRow>
            <img src={logo} alt="logo" className="navbar navbar__logo" />
            <h2>{title}</h2>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonHeader>
  );
};

export default Navbar;
