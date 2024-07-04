import React, { useState, useEffect } from 'react';
import MainLayout from "../components/layouts/MainLayout";
import Heading2 from "../subcomponents/headings/Heading2";
import { ethers } from 'ethers';

function yournftpage() {
  const [nftId, setNftId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [hasWallet, setHasWallet] = useState(false);

  // Wallet address to check against
  const userWalletAddress = '0x349EF1522ab7A5B288237b98c2fE4EDD1a89F07e';

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('NFT ID:', nftId);
    console.log('New Price:', newPrice);
    // Reset form fields
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
            <div className="mb-4">
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
            </div>
            <div className="mb-4">
              <label htmlFor="newPrice" className="block text-gray-700 mb-2">
                New Price
              </label>
              <input
                type="text"
                id="newPrice"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
          <p className="text-red-500">Only Admin has access this feature.</p>
        )}
      </div>
    </MainLayout>
  );
}

export default yournftpage;
