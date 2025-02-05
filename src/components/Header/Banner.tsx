import "./banner.css";
import ImageLogo from "../../assets/images/MoontubeLogoB&W.png";

function LogoWithText() {
  return (
    <p>
    <a href="https://onboarding.moontube.io/signup" target="_blank" rel="noopener noreferrer">
      SIGN UP TODAY! <img src={ImageLogo} height="20" alt="Moontube Logo" />
    </a>
  </p>
  );
}
export default function Banner() {
  return (
    <div className="scroller">
      <a href="https://moontube.io/comp.html" target="_blank">
        <LogoWithText />
        <LogoWithText />
        <LogoWithText />
        <LogoWithText />
        <LogoWithText />
        <LogoWithText />
      </a>
    </div>
  );
}
