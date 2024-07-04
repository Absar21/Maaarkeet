import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { nftAddress, nftMarketplaceAddress } from "../../config/networkAddress";
import NFTMarketplaceAbi from "../../abi/NFTMarketplace.json";
import NFTAbi from "../../abi/NFT.json";

import axios from "axios";
import Card from "../../subcomponents/cards/Card";
import { useRouter } from "next/router";
import Loading from "../../subcomponents/loading/Loading";
import { uploadToPinata } from "../../pinata"; // Import the Pinata upload function

export default function AllNFTs() {
  const router = useRouter();
  const [allNFTs, setAllNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to load all NFTs (Doesn't require authentication)
  const loadAllNFTs = async () => {
    console.log("Starting loadAllNFTs function...");
  
    setLoading(true);
    try {
      // Create a provider using the default Ethereum RPC endpoint
      // const provider = new ethers.providers.JsonRpcProvider(); // Adjust based on your provider configuration
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // const 
      const nftMarketPlaceContract = new ethers.Contract(nftMarketplaceAddress, NFTMarketplaceAbi, provider);
  
      console.log("Fetching all listed items...");
      const data = await nftMarketPlaceContract.getAllListedItems();
  
      console.log("Data received from getAllListedItems:", data);
  
      if (!data || !Array.isArray(data)) {
        console.warn("No data found from getAllListedItems");
        setAllNFTs([]);
        setLoading(false);
        return;
      }
      let nftContract;
      const allItems = await Promise.all(
        data.map(async (i) => {
          try {
            nftContract = new ethers.Contract(i.nftContract, NFTAbi, provider);
            let convertedPrice = ethers.utils.formatUnits(i.price.toString(), "ether");
            const tokenUri = await nftContract.tokenURI(i.tokenId);
            const metaData = await axios.get(tokenUri);
            console.log("iiii",i)
            if (!metaData || !metaData.data) {
              console.warn("Invalid metadata for token ID:", i.tokenId);
              return null;
            }
            // console.log("metaData",tokenUri, metaData.data)
  
            // const imageHash = await uploadToPinata(); // Use Pinata for uploading image
  
            let item = {
              contract:i.nftContract,
              price: convertedPrice,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: metaData.data.image,
              name: metaData.data.name,
              description: metaData.data.description,
              itemId:i.itemId.toString()
            };
  
            return item;
          } catch (error) {
            console.error("Error fetching token URI or metadata:", error);
            return null;
          }
        })
      );
      // console.log("allItems",allItems)
      setAllNFTs(allItems.filter(item => item !== null));
    } catch (error) {
      console.error("Error loading NFTs:", error);
      setAllNFTs([]);
    }
  
    setLoading(false);
    console.log("Finished loadAllNFTs function.");
  };

  useEffect(() => {
    loadAllNFTs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4">
          {allNFTs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allNFTs.map((nft,index) => (
                <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                  <Card
                    nft={nft}
                    url={`/${nft.itemId}/`}
                    onClick={() => {
                      router.push(`${nft.contract}/${nft.tokenId}`);
                      console.log("Clicked on NFT card.");
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center font-semibold text-lg mt-20">
              No NFTs found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
