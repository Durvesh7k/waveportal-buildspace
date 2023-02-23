import { useState, useEffect } from "react";
import abi from "./contractsData/Waveportal.json"
import { ethers } from 'ethers';
import wavePortaladdress from "./contractsData/Waveportal-address.json";


const getEthereumObject = () => window.ethereum;

const fetchMetamask = async () => {
  try {
    const ethereum = await getEthereumObject();
    if (!ethereum) {
      console.log("Install the metamask...")
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account");
      console.log("Connected to account: ", account)
      return account
    }
    else {
      console.log("Cannot find and authorized account");
      return null;
    }
  }
  catch (e) {
    console.error("Cannot find the metamask", e);
  }

}


export default function Home() {
  const [account, setAccount] = useState();
  const [wavesArray, setWavesArray] = useState([]);
  const [message, setMessage] = useState("");
  const [totalWaves, setTotalWaves] = useState("0");
  const contractAddress = wavePortaladdress.address;
  const contractABI = abi.abi;

  async function connectWallet() {
    try {
      const ethereum = await getEthereumObject();
      if (!window.ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchAccount() {
      const currentAccount = await fetchMetamask();
      if (account !== null) {
        setAccount(currentAccount);
      }
    }

    fetchAccount();
    loadWaves();
  }, [])



  const wave = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const waveTxn = await wavePortalContract.wave(`${message}`, { gasLimit: 300000 });
        await waveTxn.wait();

        loadWaves();

      }
      else {
        console.log("eth object not found");
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  const loadWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const waves = await wavePortalContract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000).toString(),
            message: wave.message,
          })
        })

        wavePortalContract.on("NewWave", (from, timestamp, message) => {

          setWavesArray(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        })

        const count = await wavePortalContract.getTotalWaves();
        setWavesArray(wavesCleaned);
        setTotalWaves(count.toNumber());
      }
      else {
        console.log("eth object not found");
      }
    }
    catch (e) {
      console.log(e);
    }

  }

  return (
      <div className="bg-slate-700 font-mono grid grid-cols-2 text-white" >
        <div className="h-screen flex items-center justify-center">
          <div className="grid gap-8 px-5 py-7">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Hey there!</h1>
              <button className="w-1/4 px-2 py-2 bg-slate-800  font-semibold rounded-md transition duration-200 hover:bg-slate-500 ease-in"
                onClick={connectWallet}
              >
                {account != null ? (
                  <span>Connected</span>
                ) : (
                  <span>Connect wallet</span>
                )}
              </button>
            </div>
            <p className="text-justify text-lg font-semibold">Hi I am Durvesh Chopade. I am beginner in the field of UI/UX design. In a nutshell, I create this website that help me to introduce myself to others. The main languages in my tech stack are JavaScript, React, and of course HTML/CSS. I’m a lifelong learner (currently taking a course on building AI chatbots with Python!) and love to make things out of scratch.</p>
            <textarea rows={5} cols={30} placeholder="send a message" className="text-black outline-none p-4 rounded-md"
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-left">
              <button className="w-1/4 px-2 py-2 bg-slate-800  font-semibold rounded-md transition duration-200 hover:bg-slate-500 ease-in "
                onClick={wave}
              >
                Wave at me
              </button>
            </div>
          </div>
        </div>


        <div className="px-6 py-6 h-screen w-full">
          <h1 className="font-bold text-xl">Wavers List!</h1>
          <h2 className="font-semibold text-lg">Total Number of waves: {totalWaves}</h2>
          <div className="grid grid-cols-1 w-full h-5/6 mx-1 my-4 px-4 py-4 rounded-md bg-slate-900 justify-center overflow-y-auto">
            {wavesArray.length > 0 ? (
              wavesArray.map((wave, index) => {
                return (
                  <div className="h-24 mx-4 my-3 bg-slate-600 rounded-md font-semibold" key={index}>
                    <div className="grid gap-1 items-center px-2 py-1  ">
                      <span>Account: {wave.address} </span>
                      <span>Message: {wave.message} </span>
                      <span>Time: {wave.timestamp.toString()} </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <span>No data to fetch</span>
            )}
          </div>
        </div>
      </div>
  )
}