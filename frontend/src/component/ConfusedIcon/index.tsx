import "./index.scss";
import logo from "../../assets/logo.svg";

const ConfusedIcon: React.FC = () => {
  return (
    <a href="/">
      <img className="icon" src={logo} alt="logo" />
    </a>
  );
};

export default ConfusedIcon;
