import "./banner.css";
import ImageLogo from "../../assets/images/MoontubeLogoB&W.png";

function LogoWithText() {
  return (
    <p>
      WIN $20K IN PRIZES! <img src={ImageLogo} height="20" />
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
