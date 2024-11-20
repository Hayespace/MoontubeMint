import { useAccount, useConnect, useDisconnect } from "wagmi";
import { FaCaretDown } from "react-icons/fa";
import ImageLogWord from "../../assets/images/LOG-WORD.png";
import "./navbar.css";

export default function Navbar() {
  const { connectors, connect, error } = useConnect();
  const account = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={ImageLogWord} alt="Moontube Logo" className="logo" />
      </div>
      <div className="navbar-menu-group">
        <div className="navbar-menu">
          <button className="dropdown-btn">
            Menu <FaCaretDown />
          </button>
          <div className="dropdown-content">
            <a href="comp.html">$20K Giveaway!</a>
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="pioneer.html">Pioneer Program</a>
            <a href="NFT.html">Mint</a>
            <a href="partners.html">Partners & Tech</a>
          </div>
        </div>

        <div className="navbar-menu">
          {account.status === "connected" ? (
            <>
              {account.chainId == import.meta.env.VITE_CHAIN_ID ? (
                <>
                  <button className="dropdown-btn">
                    {account.address.slice(0, 5)}...
                    {account.address.slice(account.address.length - 3)}
                    <FaCaretDown />
                  </button>
                  <div className="dropdown-content">
                    <button onClick={() => disconnect()}>Disconnect</button>
                  </div>
                </>
              ) : (
                <>
                  <button className="dropdown-btn">
                    Wrong Network
                    <FaCaretDown />
                  </button>
                  <div className="dropdown-content">
                    <button onClick={() => disconnect()}>Disconnect</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <button className="dropdown-btn">
                Connect Wallet <FaCaretDown />
              </button>
              <div className="dropdown-content">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    type="button"
                  >
                    {connector.name}
                  </button>
                ))}
                <div>{error?.message}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
