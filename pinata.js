// require('dotenv').config();
const key = "d21286c9b8ed34109013";
const secret = "a065129a160bd8282abb0a1db224b2da3bf9de15b6263f582d3100c580fa388a";
const JWT ="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZTFhZTg0OC04YzgyLTQ1NTktYjc3MS0yYjgxZDBkY2YyNjAiLCJlbWFpbCI6InNhcm9vZGF3Z0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDIxMjg2YzliOGVkMzQxMDkwMTMiLCJzY29wZWRLZXlTZWNyZXQiOiJhMDY1MTI5YTE2MGJkODI4MmFiYjBhMWRiMjI0YjJkYTNiZjlkZTE1YjYyNjNmNTgyZDMxMDBjNTgwZmEzODhhIiwiZXhwIjoxNzUxMjYyNDg3fQ.ypgA-YNG-bsrNKAoayInq36h6QRJaMi6J0bfAAk1JhU"; 
const axios = require('axios');
const FormData = require('form-data');

export const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
                "Authorization": JWT
            }
        })
        .then(function (response) {
        
           return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" +  response.data.IpfsHash
            //    pinataURL: "https://salmon-thirsty-sheep-857.mypinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);
    return axios 
        .post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                // pinata_api_key: key,
                // pinata_secret_api_key: secret,
                Authorization: JWT
            }
        })
        .then(function (response) {
            console.log("absaaaara123123123", response.data)
            return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            //    pinataURL: "https://salmon-thirsty-sheep-857.mypinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

export const EncodeIPFS = async(metadataURL) => {
    if(metadataURL.split("/")[3] === 'ipfs')
    {
        const Hash = metadataURL.split("/")[4];
        const IPFSHash = 'ipfs://' + Hash;
        return IPFSHash;
    }
    else
    {
        const IPFSHash = metadataURL;
        return IPFSHash;
    }

}

export const DecodeIPFS = async(IPFSHash) => {
    if(IPFSHash.split("/")[1] === 'ipfs')
    {
        const IPFS = IPFSHash.split("/")[3];
        const MetaURL = 'https://salmon-thirsty-sheep-857.mypinata.cloud/ipfs/' + IPFS;
        return MetaURL;
    }
    else
    {
        return IPFSHash;
    }

}