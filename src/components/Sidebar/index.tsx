import { Link, useLocation } from "react-router-dom";
import { FaLock, FaTelegram, FaTwitter } from "react-icons/fa";
import "./index.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul className="sidebar-items">
        <li className="sidebar-item">
          <a href="https://moontube.io">Home</a>
        </li>
        <li className="sidebar-item">
          <a href="https://moontube.io/about">About</a>
        </li>
        <li className="sidebar-item">
          <a href="https://moontube.io/pioneer">Pioneer Program</a>
        </li>
        <li className="sidebar-item">
          <Link to="/" className={location.pathname == "/" ? "active" : ""}>
            Mint
          </Link>
        </li>
        <li className="sidebar-item">
          <a href="https://moontube.io/partners">Partners & Tech</a>
        </li>
        <li className="sidebar-item">
          <button>
            <FaLock /> Become a moontuber
          </button>
        </li>
      </ul>
      <div className="social-container">
        <a href="https://x.com/moontubeio" target="_blank">
          <FaTwitter />
        </a>
        <a href="https://t.me/moontube_io_official" target="_blank">
          <FaTelegram />
        </a>
      </div>
    </div>
  );
}
