import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginKaryawan from './pages/LoginKaryawan';
import LoginSuccess from './pages/LoginSuccess';
import Absensi from './pages/Absensi';
import BerandaTeknisi from './pages/BerandaTeknisi';
import Antrian from './pages/Antrian';
import KurirTransport from './pages/KurirTransport';
import AbsenAkhir from './pages/AbsenAkhir';
import BerandaKurir from './pages/BerandaKurir';
import BerandaKasir from './pages/BerandaKasir';
import PilihRole from './pages/PilihRole';
import CekAbsen from './pages/CekAbsen';
import CekGaji from './pages/CekGaji';
import KontrolKerja from './pages/KontrolKerja';
import AntrianKasir from './pages/AntrianKasir';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pilih-role" element={<PilihRole />} />
        <Route path="/berandateknisi" element={<BerandaTeknisi />} />
        <Route path="/antrian/:estimasi" element={<Antrian />} />
        <Route path="/login" element={<LoginKaryawan />} />
        <Route 
          path="/loginSuccess" 
          element={<LoginSuccess />} 
        />
        <Route path="/absensi" element={<Absensi />} />
        <Route path="/berandateknisi" element={<BerandaTeknisi />} />
        <Route path="/kurir/transport" element={<KurirTransport />} />
        <Route path="/absenakhir" element={<AbsenAkhir />} />
        <Route path="/berandakurir" element={<BerandaKurir />} />
        <Route path="/berandakasir" element={<BerandaKasir />} />
        <Route path="/berandakasir/antriankasir/:estimasi" element={<AntrianKasir />} />
        <Route path="/cekabsen" element={<CekAbsen/>} />
        <Route path="/cekgaji" element={<CekGaji/>} />
        <Route path="/kontrolkerja" element={<KontrolKerja/>} />
      </Routes>
    </Router>
  );
}

export default App;
