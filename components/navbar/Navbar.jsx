// import React, { useState } from "react";
// import Link from "next/link";
// import { navLinks } from "../../data";
// import { useRouter } from "next/router";
// import {
//   AiOutlineMenuUnfold,
//   AiOutlineMenuFold,
//   AiOutlinePlus,
// } from "react-icons/ai";
// import BtnMain from "../../subcomponents/btns/BtnMain";
// import Image from "next/image"; // Importing Next.js Image component
// import { ethers } from "ethers";

// export default function Navbar() {
//   const router = useRouter();
//   const [isMobileNavOpen, setisMobileNavOpen] = useState(false);
//   const [walletadddress, setwalletadddress]=useState(null);
//   const handleClick = async () => {
//       if (!window.ethereum) {
//         alert("MetaMask is not installed. Please install it to use this app.");
//         return;
//       }
    
//       try {
//         // Switch to Sepolia network
//         // await window.ethereum.request({
//         //   method: 'wallet_addEthereumChain',
//         //   params: [{
//         //     chainId: '0xAA36A7', // Chain ID for Sepolia
//         //     chainName: 'Sepolia Test Network',
//         //     nativeCurrency: {
//         //       name: 'Sepolia',
//         //       symbol: 'ETH',
//         //       decimals: 18
//         //     },
//         //     rpcUrls: ['https://sepolia.infura.io/v3'], // Replace with your Infura project ID
//         //     blockExplorerUrls: ['https://sepolia.etherscan.io']
//         //   }]
//         // });
    
//         // Request account access if needed
//         await window.ethereum.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: '0xaa36a7' }], // Chain ID for Sepolia
//         });
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
    
//         // We use ethers to interact with the Ethereum blockchain
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
    
//         // Get the signer (the user)
//         const signer = provider.getSigner();
    
//         // Get the user's Ethereum address
//         const address = await signer.getAddress();
    
//         console.log("Connected address:", address);
//         setwalletadddress(address);
//         // You can now use the signer to sign transactions, send ethers, etc.
//         // Example: const balance = await provider.getBalance(address);
//         // console.log("Balance:", ethers.utils.formatEther(balance));
//       } catch (error) {
//         console.error("Error connecting to wallet:", error);
//         alert("Failed to connect to the wallet.");
//       }
//     };

//   return (
//     <div>
//       <div className="flex flex-wrap sys-app-notCollapsed">
//         <div className="w-full">
//           <div className="pb-0 py-2 px-2 mx-auto">
//             <div className="w-full flex justify-between items-center p-2 text-white bg-gray-800 rounded-lg shadow-lg font-medium capitalize">
//               <div className="flex items-center">
//                 <span className="px-2 mr-2 md:border-r border-gray-700 flex items-center">
//                   {/* Adjusted width and height of the Image component */}
//                   <Image
//                     src="/chadcatlogo.png" // Adjust the path according to your actual image location
//                     alt="alt placeholder"
//                     width={300} // Adjust width as needed
//                     height={80} // Adjust height as needed
//                     className="inline-block"
//                   />
//                 </span>
//                 <div className="px-2 md:flex gap-x-5 items-center flex-1 text-white font-medium capitalize hidden">
//                   {navLinks?.map(({ title, link, icon }, id) => (
//                     <Link key={id} href={link}>
//                       <a
//                         id={id}
//                         className={`px-2 py-1 flex items-center cursor-pointer hover:bg-gray-700 hover:text-gray-200 text-sm rounded ${
//                           router.pathname == link
//                             ? "text-gray-200 font-semibold"
//                             : ""
//                         }`}
//                       >
//                         <span className="p-2 bg-gray-200 rounded-full">
//                           {icon}
//                         </span>
//                         <span className="mx-1">{title}</span>
//                       </a>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//               <div className="md:flex gap-x-5 items-center">

//                 {walletadddress?<BtnMain
//                   text={walletadddress.slice(0, 10)+".."}
//                   icon={<div />}
//                   className="md:flex hidden bg-yellow-500 hover:bg-yellow-600 text-gray-900"
//                   onClick={handleClick}
//                 />:
//                 <BtnMain
//                   text="Connect wallet"
//                   icon={<div />}
//                   className="md:flex hidden bg-yellow-500 hover:bg-yellow-600 text-gray-900"
//                   onClick={handleClick}
//                 />
                
//                 }
//                 <div className="md:hidden transition-all mr-3 my-3 cursor-pointer hover:text-gray-200">
//                   {isMobileNavOpen ? (
//                     <AiOutlineMenuFold
//                       onClick={() => setisMobileNavOpen(false)}
//                       className="rounded text-2xl"
//                     />
//                   ) : (
//                     <AiOutlineMenuUnfold
//                       onClick={() => setisMobileNavOpen(true)}
//                       className="rounded text-2xl"
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Navbar */}
//           <div
//             id="navbar"
//             className={`pt-0 absolute top-2 z-100 mx-auto ${
//               isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
//             } transition-all flex-wrap md:hidden`}
//           >
//             <div className="py-[.5px] w-64">
//               <div className="w-full py-4 space-y-6 px-2 text-gray-900 bg-gray-800 rounded-lg min-h-screen text-left capitalize font-medium shadow-lg">
//                 <img
//                   src="/chadcatlogo.png"
//                   alt="alt placeholder"
//                   width={300} // Adjust width as needed
//                   height={80} // Adjust height as needed
//                   className="inline-block"
                
//                 />
//                 {navLinks?.map(({ title, link, icon }, id) => (
//                   <Link key={id} href={link}>
//                     <a
//                       id={id}
//                       className={`px-2 flex items-center cursor-pointer hover:bg-gray-700 hover:text-gray-200 text-sm rounded ${
//                         router.pathname == link
//                           ? "text-gray-200 font-semibold"
//                           : ""
//                       }`}
//                     >
//                       <span className="p-2 bg-gray-200 rounded-full">
//                         {icon}
//                       </span>
//                       <span className="mx-1">{title}</span>
//                     </a>
//                   </Link>
//                 ))}

//                 {walletadddress?<BtnMain
//                   text={walletadddress.slice(0,10)+".."}
//                   icon={<div />}
//                   className="md:flex hidden bg-yellow-500 hover:bg-yellow-600 text-gray-900"
//                   onClick={handleClick}
//                 />:
                
//                 <BtnMain
//                   text="Connect wallet"
//                   icon={<div />}
//                   className="w-full !rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
//                   onClick={handleClick}
//                 />
//                 }
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "../../data";
import { useRouter } from "next/router";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import BtnMain from "../../subcomponents/btns/BtnMain";
import Image from "next/image";
import { ethers } from "ethers";

export default function Navbar() {
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }], // Chain ID for Sepolia
        });
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log("Connected address:", address);
        setWalletAddress(address);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("Failed to connect to the wallet.");
      }
    } else {
      console.log("MetaMask not detected.");
    }
  };

  const handleClick = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkWallet();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("Failed to connect to the wallet.");
    }
  };

  const isUserAddressAllowed = () => {
    return walletAddress == '0x0d3FbFCa8d6Fc952c6ea37BC29a456f2a011853f';
  };

  return (
    <div>
      <div className="flex flex-wrap sys-app-notCollapsed">
        <div className="w-full">
          <div className="pb-0 py-2 px-2 mx-auto">
            <div className="w-full flex justify-between items-center p-2 text-white bg-gray-800 rounded-lg shadow-lg font-medium capitalize">
              <div className="flex items-center">
                <span className="px-2 mr-2 md:border-r border-gray-700 flex items-center">
                  <Image
                    src="/chadcatlogo.png"
                    alt="alt placeholder"
                    width={300}
                    height={80}
                    className="inline-block"
                  />
                </span>
                <div className="px-2 md:flex gap-x-5 items-center flex-1 text-white font-medium capitalize hidden">
                  {navLinks?.map(({ title, link, icon }, id) => (
                    <Link key={id} href={link}>
                      <a
                        id={id}
                        className={`px-2 py-1 flex items-center cursor-pointer hover:bg-gray-700 hover:text-gray-200 text-sm rounded ${
                          router.pathname == link
                            ? "text-gray-200 font-semibold"
                            : ""
                        }`}
                      >
                        <span className="p-2 bg-gray-200 rounded-full">
                          {icon}
                        </span>
                        <span className="mx-1">{title}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="md:flex gap-x-5 items-center">
                {walletAddress ? (
                  <BtnMain
                    text={walletAddress.slice(0, 10) + ".."}
                    icon={<div />}
                    className="md:flex hidden bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    onClick={handleClick}
                  />
                ) : (
                  <BtnMain
                    text="Connect Wallet"
                    icon={<div />}
                    className="md:flex hidden bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    onClick={handleClick}
                  />
                )}

                {isUserAddressAllowed() && (
                  <Link href="/yournftpage">
                    <a className="md:flex hidden bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                      Your NFT Page
                    </a>
                  </Link>
                )}

                <div className="md:hidden transition-all mr-3 my-3 cursor-pointer hover:text-gray-200">
                  {isMobileNavOpen ? (
                    <AiOutlineMenuFold
                      onClick={() => setIsMobileNavOpen(false)}
                      className="rounded text-2xl"
                    />
                  ) : (
                    <AiOutlineMenuUnfold
                      onClick={() => setIsMobileNavOpen(true)}
                      className="rounded text-2xl"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div
            id="navbar"
            className={`pt-0 absolute top-2 z-100 mx-auto ${
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            } transition-all flex-wrap md:hidden`}
          >
            <div className="py-[.5px] w-64">
              <div className="w-full py-4 space-y-6 px-2 text-gray-900 bg-gray-800 rounded-lg min-h-screen text-left capitalize font-medium shadow-lg">
                <Image
                  src="/chadcatlogo.png"
                  alt="alt placeholder"
                  width={300}
                  height={80}
                  className="inline-block"
                />
                {navLinks?.map(({ title, link, icon }, id) => (
                  <Link key={id} href={link}>
                    <a
                      id={id}
                      className={`px-2 flex items-center cursor-pointer hover:bg-gray-700 hover:text-gray-200 text-sm rounded ${
                        router.pathname == link
                          ? "text-gray-200 font-semibold"
                          : ""
                      }`}
                    >
                      <span className="p-2 bg-gray-200 rounded-full">
                        {icon}
                      </span>
                      <span className="mx-1">{title}</span>
                    </a>
                  </Link>
                ))}

                {walletAddress ? (
                  <BtnMain
                    text={walletAddress.slice(0, 10) + ".."}
                    icon={<div />}
                    className="md:flex hidden bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    onClick={handleClick}
                  />
                ) : (
                  <BtnMain
                    text="Connect Wallet"
                    icon={<div />}
                    className="w-full !rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    onClick={handleClick}
                  />
                )}

                {isUserAddressAllowed() && (
                  <Link href="/yournftpage">
                    <a className="w-full !rounded-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">
                      Your NFT Page
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
