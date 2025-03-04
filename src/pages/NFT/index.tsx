import "./index.css";
import GifMint from "../../assets/images/gif.gif";
import abi from "../../assets/abis/Moontube.json";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { useAccount } from "wagmi";

export default function NFT() {
  const alert = useAlert();
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [balance, setBalance] = useState(null);
  const [data, setData] = useState<any>({
    currentTokenId: null,
    isMintingOpen: null,
    price: null,
    fee: null,
  });

  useEffect(() => {
    const _provider = new ethers.JsonRpcProvider(
      "https://mainnet.infura.io/v3/0af50f1da48f413da22e9a3de89f57e2"
    );
    setContract(
      new Contract(import.meta.env.VITE_NFT_CONTRACT_ADDR, abi, _provider)
    );
    setProvider(_provider);
  }, []);

  async function fetchBalance() {
    const _balance = await contract.balanceOf(account.address);
    setBalance(_balance);
  }

  useEffect(() => {
    if (
      account.isConnected &&
      account.address &&
      !account.isReconnecting &&
      provider != null
    ) {
      const _signer = new ethers.JsonRpcSigner(provider, account.address);
      setContract(
        new Contract(import.meta.env.VITE_NFT_CONTRACT_ADDR, abi, _signer)
      );
      setSigner(_signer);
    } else {
      setSigner(null);
    }
  }, [account, provider]);

  useEffect(() => {
    if (signer != null) {
      fetchBalance();
    }
  }, [signer]);

  useEffect(() => {
    if (contract != null) {
      fetchContractData();
    }
  }, [contract]);

  async function fetchContractData() {
    setIsLoading(true);

    const currentTokenId = await contract.currentTokenId();
    const isMintingOpen = await contract.mintingOpen();
    const price = await contract.PRICE();
    const fee = await contract.PROVIDER_FEE();
    setData({
      currentTokenId,
      isMintingOpen,
      price: Number(ethers.formatEther(price)),
      fee: Number(ethers.formatEther(fee)),
    });

    setIsLoading(false);
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
          <div className="price">
            {isLoading ? (
              <span className="loading-text">Loading...</span>
            ) : (
              data.price
            )}{" "}
            ETH
          </div>
          <button
            disabled={isLoading || isMinting || signer == null}
            onClick={onMint}
          >
            {isLoading
              ? "Loading..."
              : signer == null
                ? "Connect Wallet"
                : isMinting
                  ? "Minting..."
                  : "Mint"}
          </button>
          <div className="minted-text">
            You've minted{" "}
            {balance == null
              ? "-"
              : balance == 0
                ? "0 NFT"
                : balance == 1
                  ? "1 NFT"
                  : `${balance} NFTs`}
          </div>
          <div>
            {isLoading ? (
              <span className="loading-text">Loading...</span>
            ) : data.currentTokenId == null ? (
              0
            ) : (
              data.currentTokenId.toString()
            )}
            /500 Minted
          </div>
        </div>
      )}
    </section>
  );
}
