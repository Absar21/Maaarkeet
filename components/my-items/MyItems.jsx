// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { nftAddress, nftMarketplaceAddress } from "../../config/networkAddress";
// import NFTMarketplaceAbi from "../../abi/NFTMarketplace.json";
// import axios from "axios";
// import Web3Modal from "web3modal";
// import Card from "../../subcomponents/cards/Card";
// import Link from 'next/link';
// import Loading from "../../subcomponents/loading/Loading";

// export default function MyItems() {
//   const [allNFTs, setAllNFTs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Only loads the NFTs which are purchased by the user.
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
//         NFTMarketplaceAbi,
//         signer
//       );

//       const data = await nftMarketPlaceContract.getOwnerListedItems();

//       if (!data || !Array.isArray(data)) {
//         setAllNFTs([]);
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
//             tokenId: i.tokenId.toNumber(),
//             seller: i.seller,
//             owner: i.owner,
//             image: metaData.data.image,
//             name: metaData.data.name,
//             description: metaData.data.description,
//           };
//           return item;
//         })
//       );

//       setAllNFTs(allItems);
//     } catch (error) {
//       console.error("Error loading NFTs:", error);
//       setAllNFTs([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     const load = async () => {
//       await loadMyNFTs();
//       console.log(allNFTs);
//     };
//     load();
//   }, []);

//   return (
//     <div>
//       {loading ? (
//         <Loading />
//       ) : (
//         <div>
//           {allNFTs.length > 0 ? (
//             allNFTs.map((nft, index) => (
//               <div key={index}>
//                 <Card
//                   nft={nft}
//                   url="/my-items/"
//                   onClick={() => buyNFT(nft)}
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="text-center font-semibold text-base">
//               No purchase History found.
//               <Link href="/">Buy Now some</Link>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { nftMarketplaceAddress } from "../../config/networkAddress";
import axios from "axios";
import NFTMarketplaceAbi from '../../abi/NFTMarketplace.json'
import NFTAbi from '../../abi/NFT.json'

import Card from "../../subcomponents/cards/Card";
import Link from 'next/link';
import Loading from "../../subcomponents/loading/Loading";


export default function MyItems() {
  const [allNFTs, setAllNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Only loads the NFTs which are purchased by the user.
  const loadMyNFTs = async () => {
    setLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(nftMarketplaceAddress, NFTMarketplaceAbi, signer);
        const nftMarketPlaceContract = new ethers.Contract(
          nftMarketplaceAddress,
          NFTMarketplaceAbi,
          signer
        );

        const data = await nftMarketPlaceContract.getOwnerListedItems();

        if (!data || !Array.isArray(data)) {
          setAllNFTs([]);
          setLoading(false);
          return;
        }

        const allItems = await Promise.all(
          data.map(async (i, index) => {
            console.log("iii",i)
            try{
              const nftContract = new ethers.Contract(i.nftContract, NFTAbi, signer);
          
              let convertedPrice = ethers.utils.formatUnits(i.price.toString(), "ether");
              const tokenUri = await nftContract.tokenURI(i.tokenId);
              const metaData = await axios.get(tokenUri);
              console.log("metaData",metaData.data)
              let item = {
                contract:i.nftContract,
                price: convertedPrice,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: metaData.data.image,
                name: metaData.data.name,
                description: metaData.data.description,
                position: index, // Add position to identify the index
              };
              // console.log("item",item)
              return item;}catch{
                console.log("error")
              }

          })
        );
        console.log("allItems",allItems)

        setAllNFTs(allItems);
      } else {
        console.error("Ethereum object not found, install Metamask.");
        setAllNFTs([]);
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
      setAllNFTs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await loadMyNFTs();
      console.log(allNFTs);
    };
    load();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {allNFTs.length > 0 ? (
            allNFTs.map((nft, index) => (
              <div key={index}>
                <Card
                  nft={nft}
                  url="/my-items/"
                  // onClick={() => buyNFT(nft)}
                />
              </div>
            ))
          ) : (
            <div className="text-center font-semibold text-base">
              No purchase History found.
              <Link href="/">Buy Now some</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
