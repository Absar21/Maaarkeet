// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { nftAddress, nftMarketplaceAddress } from "../../config/networkAddress";
// import NFTAbi from "../../abi/NFT.json";
// import NFTMarketplaceAbi from "../../abi/NFTMarketplace.json";
// import axios from "axios";
// import Web3Modal from "web3modal";
// import Card from "../../subcomponents/cards/Card";
// import Link from "next/link";
// import Heading3 from "../../subcomponents/headings/Heading3";
// import Loading from "../../subcomponents/loading/Loading";
// import BtnMain from "../../subcomponents/btns/BtnMain";
// import { useRouter } from "next/router";

// export default function SellerItems() {
//   const router = useRouter();
//   const [listedNFTs, setListedNFTs] = useState([]);
//   const [soldNFTs, setSoldNFTs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Loads all the nfts which are either listed or sold of user.
//   const loadMyNFTs = async () => {
//     setLoading(true);
//     try {
//       const web3Modal = new Web3Modal();
//       const connection = await web3Modal.connect();
//       const provider = new ethers.providers.Web3Provider(connection);
//       const signer = provider.getSigner();

//       const nftContract = new ethers.Contract(nftAddress, NFTMarketplaceAbi, signer);
//       const nftMarketPlaceContract = new ethers.Contract(
//         nftMarketplaceAddress,
//         NFTMarketplaceAbi.abi,
//         signer
//       );
//       const data = await nftMarketPlaceContract.getSellerListedItems();
//       console.log("This is your data ", data);

//       if (!data || !Array.isArray(data)) {
//         setListedNFTs([]);
//         setSoldNFTs([]);
//         setLoading(false);
//         return;
//       }

//       const allItems = await Promise.all(
//         data.map(async (i) => {
//           let convertedPrice = ethers.utils.formatUnits(i.price.toString(), "ether");
//           const tokenUri = await nftContract.tokenURI(i.tokenId);
//           const metaData = await axios.get(tokenUri);
//           let item = {
//             price: convertedPrice,
//             sold: i.sold,
//             tokenId: i.tokenId.toNumber(),
//             seller: i.seller,
//             owner: i.owner,
//             image: metaData.data.image,
//             name: metaData.data.name,
//             description: metaData.data.description,
//           };
//           console.log(item);
//           return item;
//         })
//       );

//       // Filter to get only listed NFTs
//       let currentListedItems = allItems.filter((item) => !item.sold);
//       setListedNFTs(currentListedItems);
      
//       // Filter to get only sold NFTs
//       let soldItems = allItems.filter((item) => item.sold);
//       setSoldNFTs(soldItems);
//       console.log(soldItems);
//       console.log(currentListedItems);
//     } catch (error) {
//       console.error("Error loading NFTs:", error);
//       setListedNFTs([]);
//       setSoldNFTs([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     const load = async () => {
//       await loadMyNFTs();
//       console.log(listedNFTs);
//     };
//     load();
//   }, []);

//   return (
//     <div>
//       {loading ? (
//         <Loading />
//       ) : (
//         <div>
//           <div>
//             <Heading3 title="Listed NFTs" />
//             <div className="grid grid-cols-3">
//               {listedNFTs.length > 0 ? (
//                 listedNFTs.map((nft, index) => (
//                   <div key={index}>
//                     <Card
//                       nft={nft}
//                       url="/my-listed-items/"
//                       onClick={() => {
//                         buyNFT(nft);
//                         console.log("Onclicked on buy button.");
//                       }}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="font-semibold text-base flex items-center gap-x-2">
//                   No Listed NFTs found <span><BtnMain text="List Now" onClick={() => router.push("/sell")} /></span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sold list */}
//           <div>
//             <Heading3 title="Sold NFTs" />
//             <div className="grid grid-cols-3">
//               {soldNFTs.length > 0 ? (
//                 soldNFTs.map((nft, index) => (
//                   <div key={index}>
//                     <Card
//                       nft={nft}
//                       url="/my-listed-items/"
//                       onClick={() => {
//                         buyNFT(nft);
//                         console.log("Onclicked on buy button.");
//                       }}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="font-semibold text-base">
//                   No NFTs sold yet
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {  nftMarketplaceAddress } from "../../config/networkAddress";
import NFTMarketplaceAbi from "../../abi/NFTMarketplace.json";
import axios from "axios";
import Card from "../../subcomponents/cards/Card";
import Link from "next/link";
import Heading3 from "../../subcomponents/headings/Heading3";
import Loading from "../../subcomponents/loading/Loading";
import BtnMain from "../../subcomponents/btns/BtnMain";
import { useRouter } from "next/router";

export default function SellerItems() {
  const router = useRouter();
  const [listedNFTs, setListedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Loads all the NFTs which are either listed or sold by the user.
  const loadMyNFTs = async () => {
    setLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const nftMarketPlaceContract = new ethers.Contract(nftMarketplaceAddress, NFTMarketplaceAbi, signer);

        const data = await nftMarketPlaceContract.getSellerListedItems();
        console.log("This is your data ", data);

        if (!data || !Array.isArray(data)) {
          setListedNFTs([]);
          setSoldNFTs([]);
          setLoading(false);
          return;
        }
        let nftContract;
        const allItems = await Promise.all(
          data.map(async (i) => {
            console.log('iiii',i);
            nftContract = new ethers.Contract(i.contract, NFTMarketplaceAbi, signer);

            let convertedPrice = ethers.utils.formatUnits(i.price.toString(), "ether");
            const tokenUri = await nftContract.tokenURI(i.tokenId);
            const metaData = await axios.get(tokenUri);
            let item = {
              contract:nftContract,
              price: convertedPrice,
              sold: i.sold,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: metaData.data.image,
              name: metaData.data.name,
              description: metaData.data.description,
            };
            console.log(item);
            return item;
          })
        );

        // Filter to get only listed NFTs
        let currentListedItems = allItems.filter((item) => !item.sold);
        setListedNFTs(currentListedItems);

        // Filter to get only sold NFTs
        let soldItems = allItems.filter((item) => item.sold);
        setSoldNFTs(soldItems);
        console.log(soldItems);
        console.log(currentListedItems);
      } else {
        console.error("Ethereum object not found, install Metamask.");
        setListedNFTs([]);
        setSoldNFTs([]);
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
      setListedNFTs([]);
      setSoldNFTs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await loadMyNFTs();
      console.log(listedNFTs);
    };
    load();
  }, [listedNFTs]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div>
            <Heading3 title="Listed NFTs" />
            <div className="grid grid-cols-3">
              {listedNFTs.length > 0 ? (
                listedNFTs.map((nft, index) => (
                  <div key={index}>
                    <Card
                      nft={nft}
                      url="/my-listed-items/"
                      onClick={() => {
                        buyNFT(nft);
                        console.log("Clicked on buy button.");
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="font-semibold text-base flex items-center gap-x-2">
                  No Listed NFTs found <span><BtnMain text="List Now" onClick={() => router.push("/sell")} /></span>
                </div>
              )}
            </div>
          </div>

          {/* Sold list */}
          <div>
            <Heading3 title="Sold NFTs" />
            <div className="grid grid-cols-3">
              {soldNFTs.length > 0 ? (
                soldNFTs.map((nft, index) => (
                  <div key={index}>
                    <Card
                      nft={nft}
                      url="/my-listed-items/"
                      onClick={() => {
                        // buyNFT(nft);
                        console.log("Clicked on buy button.");
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="font-semibold text-base">
                  No NFTs sold yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
