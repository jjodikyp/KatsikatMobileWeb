import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginKaryawan from './pages/LoginKaryawan';
import LoginSuccess from './pages/LoginSuccess';
import Absensi from './pages/Absensi';
import Beranda from './pages/Beranda';
import Antrian from './pages/Antrian';
import KurirTransport from './pages/KurirTransport';
import AbsenAkhir from './pages/AbsenAkhir';
import BerandaKurir from './pages/BerandaKurir';
import BerandaKasir from './pages/BerandaKasir';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/antrian/:estimasi" element={<Antrian />} />
        <Route path="/login" element={<LoginKaryawan />} />
        <Route 
          path="/loginSuccess" 
          element={<LoginSuccess />} 
        />
        <Route path="/absensi" element={<Absensi />} />
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/kurir/transport" element={<KurirTransport />} />
        <Route path="/absenakhir" element={<AbsenAkhir />} />
        <Route path="/berandakurir" element={<BerandaKurir />} />
        <Route path="/berandakasir" element={<BerandaKasir />} />
      </Routes>
    </Router>
  );
}

export default App;
