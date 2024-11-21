import { Link, useLocation } from "react-router-dom";
import { FaLock, FaTelegram, FaTwitter } from "react-icons/fa";
import "./index.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul className="sidebar-items">
        <li className="sidebar-item">
          <Link to="https://moontube.io/comp" className="giveaway-btn">
            $20K Giveaway!
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="https://moontube.io/">Home</Link>
        </li>
        <li className="sidebar-item">
          <Link to="https://moontube.io/about">About</Link>
        </li>
        <li className="sidebar-item">
          <Link to="https://moontube.io/pioneer">Pioneer Program</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/" className={location.pathname == "/" ? "active" : ""}>
            Mint
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="https://moontube.io/partners">Partners & Tech</Link>
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
