import "./index.css";
import GifMint from "../../assets/images/gif.gif";
import abi from "../../assets/abis/Moontube.json";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { Config, useAccount } from "wagmi";
import { Account, Chain, Client, Transport } from "viem";
import { getConnectorClient } from "wagmi/actions";
import { config } from "../../wagmi";

export default function NFT() {
  const alert = useAlert();
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [data, setData] = useState<any>({
    currentTokenId: null,
    balance: null,
    isMintingOpen: null,
    price: null,
    fee: null,
  });

  function clientToSigner(client: Client<Transport, Chain, Account>) {
    const { account, chain, transport } = client;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.BrowserProvider(transport, network);
    setSigner(new ethers.JsonRpcSigner(provider, account.address));
  }

  useEffect(() => {
    const initializeSigner = async (
      config: Config,
      { chainId }: { chainId?: number }
    ) => {
      const client = await getConnectorClient(config, { chainId });
      clientToSigner(client);
    };

    if (account.isConnected) {
      initializeSigner(config, { chainId: 1 });
    } else {
      setSigner(null);
    }
  }, [account]);

  useEffect(() => {
    if (signer == null) {
      alert.show("Wallet is not connected.", { type: "info" });
    } else {
      alert.show("Wallet is connected.", { type: "success" });
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
    setIsLoading(true);
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

      {signer == null ? (
        <div className="error-message">Wallet is not connected.</div>
      ) : isLoading ? (
        <div className="loading-message">Loading...</div>
      ) : data.isMintingOpen == false ? (
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
