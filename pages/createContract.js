import React, { useState } from 'react';
import Input from '../subcomponents/inputs/Input'; // Adjusted path
import BtnMain from '../subcomponents/btns/BtnMain'; // Adjusted path
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import NFTMarketplaceAbi from '../abi/NFTMarketplace.json'; // Adjusted path

export default function CreateContract() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contractName: '',
    contractSymbol: '',
  });

  const interactWithContract = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contractAddress = '0x88DC96e5B60E0b9a0935450853334FAf31a1d4E1'; // Ensure this is the correct contract address

      if (!NFTMarketplaceAbi) {
        throw new Error('ABI is not defined correctly. Please check the ABI file.');
      }

      const contract = new ethers.Contract(contractAddress, NFTMarketplaceAbi, signer);

      // Call createContract function on the smart contract
      const tx = await contract.createContract(formData.contractName, formData.contractSymbol);
      await tx.wait(); // Wait for the transaction to be mined
      console.log('Contract interaction result:', tx);

      // Redirect to another page after contract creation (example: back to home page)
      router.push('/sell');
    } catch (error) {
      console.error('Error interacting with contract:', error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    interactWithContract();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Create New Contract</h1>
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-6">
            <Input
              id="contractName"
              label="Contract Name"
              placeholder="Enter contract name"
              value={formData.contractName}
              onChange={(e) =>
                setFormData({ ...formData, contractName: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <Input
              id="contractSymbol"
              label="Contract Symbol"
              placeholder="Enter contract symbol"
              value={formData.contractSymbol}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contractSymbol: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-center">
            <BtnMain text="Create Contract" type="submit" className="px-6 py-2" />
          </div>
        </form>
      </div>
    </div>
  );
}
