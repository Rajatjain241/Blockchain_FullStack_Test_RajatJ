import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import AssetDetail from './pages/AssetDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/assets/:tokenId" element={<AssetDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;