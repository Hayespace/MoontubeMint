import "./index.css";
import GifMint from "../../assets/images/gif.gif";
import abi from "../../assets/abis/Moontube.json";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { ethers } from "ethers";
import { Contract } from "ethers";

export default function NFT() {
  const alert = useAlert();
  const [isMinting, setIsMinting] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [data, setData] = useState<any>({
    currentTokenId: null,
    balance: null,
    isMintingOpen: null,
    price: null,
    fee: null,
  });

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum == null) {
        setProvider(ethers.getDefaultProvider());
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
      }
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    const initializeSigner = async () => {
      setSigner(await provider.getSigner());
    };

    if (provider != null) {
      initializeSigner();
    }
  }, [provider]);

  useEffect(() => {
    if (signer != null) {
      setContract(
        new Contract(import.meta.env.VITE_NFT_CONTRACT_ADDR, abi, signer)
      );
    }
  }, [signer]);

  useEffect(() => {
    if (contract != null) {
      readData();
    }
  }, [contract]);

  async function readData() {
    const currentTokenId = await contract.currentTokenId();
    const balance = await contract.balanceOf(signer.address);
    const isMintingOpen = await contract.mintingOpen();
    const price = await contract.PRICE();
    const fee = await contract.PROVIDER_FEE();
    setData({
      currentTokenId,
      balance: ethers.formatEther(balance),
      isMintingOpen,
      price: Number(ethers.formatEther(price)),
      fee: Number(ethers.formatEther(fee)),
    });
  }

  async function onMint() {
    setIsMinting(true);
    try {
      const tx = await contract.mintToMultiple(signer.address, 1, {
        value: ethers.parseEther(`${data.price + data.fee}`),
      });
      await tx.wait();
      alert.show("Minted Successfully!", { type: "success" });
    } catch (error) {
      alert.show(`${error}`, {
        type: "error",
      });
    }
    setIsMinting(false);
  }

  return (
    <section>
      <div className="info-box">
        <h1>Mint Your Moontube Profit Share NFTs</h1>
        <p>
          The Moontube Pioneer Program NFT entitles holders to a share of 5% of
          Moontube’s revenue, distributed among all NFT owners.
        </p>
        <p>
          <strong>Early minters are already earning airdrops!</strong>
        </p>
        <p>
          And that’s not all—each NFT minted comes with{" "}
          <strong>$200 worth of Moontube tokens</strong> on launch when you sign
          up and complete tasks on the platform when it goes live!
        </p>
      </div>

      {data.isMintingOpen == false ? (
        <div className="error-message">Mint is not allowed!</div>
      ) : (
        <div className="mint-card">
          <img src={GifMint} alt="Mint Image" />
          <div className="price">{data.price} ETH</div>
          <button disabled={isMinting} onClick={onMint}>
            {isMinting ? "Minting..." : "Mint"}
          </button>
          <div className="minted-text">
            You've minted{" "}
            {data.balance == null || data.balance == 0
              ? "0 NFT"
              : data.balance == 1
                ? "1 NFT"
                : `${data.balance} NFTs`}
          </div>
          <div>
            {data.currentTokenId == null ? 0 : data.currentTokenId.toString()}
            /500 Minted
          </div>
        </div>
      )}
    </section>
  );
}
