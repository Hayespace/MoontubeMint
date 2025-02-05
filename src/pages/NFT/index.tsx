import "./index.css";
import GifMint from "../../assets/images/gif.gif";
import abi from "../../assets/abis/Moontube.json";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useEffect } from "react";
import { useAlert } from "react-alert";

export default function NFT() {
  const { address, status } = useAccount();
  const { isPending, writeContract, error, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const alert = useAlert();

  useEffect(() => {
    if (isSuccess) {
      alert.show("Minted Successfully!", { type: "success" });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error?.message) {
      alert.show(error?.message, { type: "error" });
    }
  }, [error]);

  const { data: currentTokenId }: any = useReadContract({
    address: import.meta.env.VITE_NFT_CONTRACT_ADDR,
    abi,
    functionName: "currentTokenId",
  });
  const { data: balance }: any = useReadContract({
    address: import.meta.env.VITE_NFT_CONTRACT_ADDR,
    abi,
    functionName: "balanceOf",
    args: [address],
  });
  const { data: isMintingOpen } = useReadContract({
    address: import.meta.env.VITE_NFT_CONTRACT_ADDR,
    abi,
    functionName: "mintingOpen",
  });
  const { data: price }: any = useReadContract({
    address: import.meta.env.VITE_NFT_CONTRACT_ADDR,
    abi,
    functionName: "PRICE",
  });
  const { data: fee }: any = useReadContract({
    address: import.meta.env.VITE_NFT_CONTRACT_ADDR,
    abi,
    functionName: "PROVIDER_FEE",
  });
  //   const { data: maxBatchSize }: any = useReadContract({
  //     address: import.meta.env.VITE_NFT_CONTRACT_ADDR,
  //     abi,
  //     functionName: "maxBatchSize",
  //   });

  async function onMint() {
    if (status === "connected") {
      writeContract({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDR,
        abi,
        functionName: "mintToMultiple",
        args: [address, 1],
        value: price + fee,
      });
    } else {
      alert.show("Wallet is not connected!", { type: "error" });
    }
  }

  return (
    <section>
      <div class="info-box">
    <h1>Mint Your Moontube Profit Share NFTs</h1>
    <p>
        The Moontube Pioneer Program NFT entitles holders to a **share of 5% of Moontube’s total revenue**, distributed among all NFT owners. Revenue sources include:
    </p>
    <ul>
        <li>Trending services</li>
        <li>Paid banners</li>
        <li>CEX listing commissions</li>
        <li>Market maker fees</li>
        <li>Audit commissions</li>
        <li>Bulk airdropper fees</li>
        <li>Swap fees</li>
        <li>Trending video boosts</li>
        <li>KOL and project trending</li>
        <li>Presale promo clicks</li>
        <li>Moontuber hire commissions & more!</li>
    </ul>
    <p><strong>Early minters are already earning airdrops!</strong></p>
    <p>Follow us on <a href="https://twitter.com/moontubeio" target="_blank">Twitter</a> to see how we’re rewarding early supporters.</p>
    <p>And that’s not all—each NFT minted comes with <strong>$200 worth of Moontube tokens</strong> on launch!</p>
</div>

      {isMintingOpen == false ? (
        <div className="error-message">Mint is not allowed!</div>
      ) : (
        <div className="mint-card">
          <img src={GifMint} alt="Mint Image" />
          <div className="price">0.15 ETH</div>
          <button disabled={isPending || isLoading} onClick={onMint}>
            {isPending ? "Confirming..." : isLoading ? "Minting..." : "Mint"}
          </button>
          <div className="minted-text">
            You've minted{" "}
            {balance == undefined || balance == 0
              ? "0 NFT"
              : balance == 1
                ? "1 NFT"
                : `${balance} NFTs`}
          </div>
          <div>
            {currentTokenId == undefined ? 0 : currentTokenId.toString()}/500
            Minted
          </div>
        </div>
      )}
    </section>
  );
}
