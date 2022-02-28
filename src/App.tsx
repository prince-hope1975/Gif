import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

// Constants
const TWITTER_HANDLE = "prince_RedEyes";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://media4.giphy.com/media/l2YWqU7ev0l5nfYTC/200w.webp?cid=ecf05e472izkj3bm05dw7ck313oi6a3brrng04gddzeg06q0&rid=200w.webp&ct=g",
  "https://media1.giphy.com/media/x2NZByIJT0WW0BPayC/200w.webp?cid=ecf05e472izkj3bm05dw7ck313oi6a3brrng04gddzeg06q0&rid=200w.webp&ct=g",
  "https://media3.giphy.com/media/WrxoaVPiq0cG4/giphy.webp?cid=ecf05e472izkj3bm05dw7ck313oi6a3brrng04gddzeg06q0&rid=giphy.webp&ct=g",
  "https://media2.giphy.com/media/3o84Ughbtrcsp8OAM0/200w.webp?cid=ecf05e472izkj3bm05dw7ck313oi6a3brrng04gddzeg06q0&rid=200w.webp&ct=g",
];
const App = () => {

  const [walletAddress, setWalletAddress] = useState("");
  const [inputValue, setInputValue ]= useState("")
  const [gifList, setGifList] =useState<String[] | undefined>([])
  const checkIfWalletIsConnected = async (): Promise<any> => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found");
          const response = await solana.connect({
            onlIfTrusted: true,
          });
          console.log(
            "Connected with Public key: ",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana Object not found! Get a Phantom wallet 👻");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const connectWallet = async () => {
    const {solana} = window

    if (solana){
      const response = await solana.connect({
        onlIfTrusted: true,
      });
      console.log("Connected with Public key: ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());

    }
  };
  const sendGif = async ()=>{
    if(inputValue.length > 0){
      console.log("Gif Link", inputValue)
      setGifList([...gifList, inputValue])
    }
    else{
      console.log("Empty input. Try Again")
    }
  }
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to wallet
    </button>
  );
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form onSubmit={(e)=>{
        e.preventDefault()
        sendGif()
      }}>
        <input type="text"placeholder="Enter a valid Gif link!"
        value={inputValue}
        onChange={(e)=>setInputValue(e.target.value)}
        />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  //  when our  component first mounts, let's check to see if we have a connected
  // Phantom wallet

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  useEffect(()=>{
    if(walletAddress){
      console.log("Fetching GIF list...")
      // call Solana Program here

      // Set State
      setGifList(TEST_GIFS)
    }
  })

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼️ GIF Emporium</p>
          <p className="sub-text">
           Gif collection live on Solana Blockchain ✨
          </p>
          {!walletAddress ? renderNotConnectedContainer():renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
