import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import Select from 'react-select';
import {  nftMarketplaceAddress } from '../../config/networkAddress';
import NFTMarketplaceAbi from '../../abi/NFTMarketplace.json';
import nftcontract from '../../abi/NFT.json';

import Input from '../../subcomponents/inputs/Input';
import { AiOutlineArrowUp } from 'react-icons/ai';
import BtnMain from '../../subcomponents/btns/BtnMain';
import { uploadJSONToIPFS, uploadFileToIPFS } from "../../pinata"; // Assuming you have functions for Pinata
import Link from 'next/link';

export default function ListItem() {
  const router = useRouter();
  const [isListing, setIsListing] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    name: '',
    description: '',
  });
  const [selectedContract, setSelectedContract] = useState(null);
  const [contractOptions, setContractOptions] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  useEffect(() => {
    let isMounted = true;
  
    const loadContractOptions = async () => {
      setLoadingContracts(true);
      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const walletAddress = await signer.getAddress();
  
        const nftMarketPlaceContract = new ethers.Contract(
          nftMarketplaceAddress,
          NFTMarketplaceAbi,
          provider
        );
  
        const listedContracts = await nftMarketPlaceContract.getListedContracts(walletAddress);
        console.log('listedContracts',listedContracts)
        const options = listedContracts.map((data) => {
          console.log('data',data.nftContract,)
          
          return {
          value: data.nftContract,
          label: `${data.nftContract}`
        }
      
      }
      
      );
      console.log("options", options)
  
        setContractOptions(options);
      } catch (error) {
        console.error('Error loading contract options:', error);
      } finally {
        setLoadingContracts(false);
      }
    };
  
    if (isMounted) {
      loadContractOptions();
    }
  
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this effect runs only once on component mount
  

  const onChange = async (e) => {
    const fileData = e.target.files[0];
    let data = await uploadFileToIPFS(fileData);
    setFile(data.pinataURL);
  };

  const createItem = async (url) => {
    setIsListing(true);
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nfContract = new ethers.Contract(
      selectedContract.value,
      nftcontract,
      signer
    );
    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi,
      signer
    );

    try {
      // Mint a new token
      let transaction = await nfContract.mintToken(url);
      let tx = await transaction.wait();
      let event = tx.events[0];
      let tokenId = event.args[2].toNumber();

      // Convert price to Wei
      let convertedPrice = ethers.utils.parseUnits(formData.price, 'ether');

      // Get listing price from contract
      let listingPrice = await nftMarketPlaceContract.getListingPrice();
      listingPrice = listingPrice.toString();

      // List the item for sale
      let listingTx = await nftMarketPlaceContract.listItem(
        selectedContract.value,
        tokenId,
        convertedPrice,
        { value: listingPrice }
      );
      await listingTx.wait();

      // Redirect to homepage after successful listing
      router.push('/');
    } catch (error) {
      console.error('Error listing NFT:', error);
    } finally {
      setIsListing(false);
    }
  };

  const listAnItem = async () => {
    setIsListing(true);
    const { name, price, description } = formData;

    // Validate form fields
    if (!name || !price || !description || !file || !selectedContract) {
      console.log('Some fields are missing');
      setIsListing(false);
      return;
    }

    // Upload JSON data to IPFS
    const data = { name, description, image: file };
    try {
      const add = await uploadJSONToIPFS(data);
      createItem(add.pinataURL); // Create and list the NFT
    } catch (error) {
      console.error('Error in listAnItem function:', error);
      setIsListing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="self-end p-4">
        <Link href="./createContract">
          <a>
            <button className="btn btn-secondary">Create contract</button>
          </a>
        </Link>
      </div>
      <div className="p-4 w-full md:w-3/6">
        <Input
          id="name"
          placeholder="e.g. Monkey"
          label="Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          id="description"
          placeholder="e.g. This is the most unique monkey in the world."
          label="Description"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Input
          id="price"
          placeholder="e.g. 10 (In Ether)"
          label="Price"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <Select
          name="contractOptions"
          label="Choose Contract"
          options={contractOptions}
          onChange={(option) => setSelectedContract(option)}
          value={selectedContract}
          isLoading={loadingContracts}
          loadingMessage={() => 'Loading contracts...'}
          noOptionsMessage={() => 'No contracts found'}
        />
        <Input
          id="file"
          placeholder="Choose image file"
          label="NFT Image"
          type="file"
          onChange={onChange}
        />
        <div className="">
          {file && (
            <img
              className="rounded-xl mt-4 mb-10 w-96"
              src={file}
              alt="Chosen image"
            />
          )}
        </div>
        <BtnMain
          text="List NFT"
          icon={<AiOutlineArrowUp className="text-2xl" />}
          className="w-full text-lg"
          onClick={listAnItem}
          disabled={isListing}
        />
      </div>
    </div>
  );
}
