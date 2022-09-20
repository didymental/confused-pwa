import "./index.scss";
import logo from "../../assets/logo.svg";
import logoLight from "../../assets/logo-light.svg";

interface UseLightLogo {
  useLightLogo?: boolean;
}

const ConfusedIcon: React.FC<UseLightLogo> = ({ useLightLogo = false }) => {
  return (
    <a href="/">
      {useLightLogo ? (
        <img className="icon" src={logoLight} alt="logo" />
      ) : (
        <img className="icon" src={logo} alt="logo" />
      )}
    </a>
  );
};

export default ConfusedIcon;
