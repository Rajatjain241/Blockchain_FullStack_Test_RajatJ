import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Marketplace() {
    const [assets, setAssets] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        axios.get('http://localhost:5000/assets/?owner_id=0xA0d02Ba23D9a47d321A3c2d4A7FA2D4c11636a88&forSale=false') // replace with your Node.js API URL
            .then(res => setAssets(res.data))
            .catch(err => alert('Failed to load assets.'));
    }, []);

    const filteredAssets = assets.filter(asset => {
        if (filter === 'all') return true;
        return asset.status === filter;
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4 font-bold">Marketplace</h1>
            <div className="mb-4 space-x-4">
                {['all', 'tokenized', 'staked', 'for-sale'].map(f => (
                    <button key={f} className="px-4 py-2 border" onClick={() => setFilter(f)}>{f}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredAssets.map(asset => (
                    <Link to={`/assets/${asset.token_id}`} key={asset.token_id} className="border p-4 rounded hover:shadow">
                        <h2 className="text-lg font-semibold">{asset.name}</h2>
                        <p>Type: {asset.type}</p>
                        <p>Status: {asset.status}</p>
                        <p>Price: {asset.price}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Marketplace;
