import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import ABI from '../abi/nftContractAbi.json';

function AssetDetail() {
    const { tokenId } = useParams();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/assets/?${tokenId}`)
            .then(res => setAsset(res.data[0]))
            .catch(() => alert('Failed to load asset.'));
    }, [tokenId]);

    const connectWallet = async () => {
        if (!window.ethereum) return alert('MetaMask not detected');
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        await ethProvider.send("eth_requestAccounts", []);
        setProvider(ethProvider);
        setSigner(ethProvider.getSigner());
    };

    const handleMint = async () => {
        try {
            setLoading(true);
            // const contract = new ethers.Contract(`0xD6462BC4fE0F1da334AB574c304037F43A29928C`, ABI, signer);
            // const tx = await contract.mintNFT(tokenId, { value: ethers.utils.parseEther(asset.price.toString()) });
            // await tx.wait();
            alert('NFT minted!');
        } catch (err) {
            console.error(err);
            alert('Minting failed');
        } finally {
            setLoading(false);
        }
    };

    if (!asset) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{asset.name}</h1>
            <p>Type: {asset.type}</p>
            <p>Status: {asset.status}</p>
            <p>Price: {asset.price}</p>
            <p>Token ID: {asset.token_id}</p>

            <div className="mt-6 space-x-4">
                {!provider && (
                    <button className="px-4 py-2 bg-blue-500 text-white" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}
                {asset.status === 'not-tokenized' && (
                    <button disabled={loading} onClick={handleMint} className="px-4 py-2 bg-green-500 text-white">
                        {loading ? 'Minting...' : 'Mint NFT'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default AssetDetail;
