import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layouts/MainLayout";
import Heading2 from "../subcomponents/headings/Heading2";
import { ethers } from 'ethers';
import {  nftMarketplaceAddress } from "/config/networkAddress";
import NFTMarketplaceAbi from "/abi/NFTMarketplace.json";

function YourNftPage() {
  const [nftId, setNftId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [hasWallet, setHasWallet] = useState(false);

  // Wallet address to check against
  const userWalletAddress = '0x0d3FbFCa8d6Fc952c6ea37BC29a456f2a011853f';
  
  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0 && accounts[0].toLowerCase() === userWalletAddress.toLowerCase()) {
        setHasWallet(true);
      } else {
        setHasWallet(false);
      }
    } else {
      setHasWallet(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('NFT ID:', nftId);
    console.log('New Price:', newPrice);
    // Reset form fields
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    if ( address.toLowerCase() === userWalletAddress.toLowerCase()) {
      

      const nftMarketPlaceContract = new ethers.Contract(nftMarketplaceAddress, NFTMarketplaceAbi, signer);
      let convertedPrice = ethers.utils.parseEther(newPrice);

      let ddata=await nftMarketPlaceContract.setListingPrice(convertedPrice)
      ddata.wait()
      alert("listing price changed successfully")


    } 
    setNftId('');
    setNewPrice('');
  };

  return (
    <MainLayout>
      <Heading2 title="Admin Dashboard" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Change Listing Price</h3>
        {hasWallet ? (
          <form onSubmit={handleFormSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md">
            {/* <div className="mb-4">
              <label htmlFor="nftId" className="block text-gray-700 mb-2">
                NFT ID
              </label>
              <input
                type="text"
                id="nftId"
                value={nftId}
                onChange={(e) => setNftId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div> */}
            <div className="mb-4">
              <label htmlFor="newPrice" className="block text-gray-700 mb-2">
                New Price
              </label>
              <input
                type="text"
                id="newPrice"
                value={newPrice}
                onChange={(e) => {setNewPrice(e.target.value)}}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Update Price
            </button>
          </form>
        ) : (
          <p className="text-red-500">Only Admin has access to this page.</p>
        )}
      </div>
    </MainLayout>
  );
}

export default YourNftPage;
