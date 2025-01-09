import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginKaryawan from './pages/LoginKaryawan';
import LoginSuccess from './pages/LoginSuccess';
import Absensi from './pages/Absensi';
import Beranda from './pages/Beranda';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginKaryawan />} />
        <Route 
          path="/loginSuccess" 
          element={<LoginSuccess />} 
        />
        <Route path="/absensi" element={<Absensi />} />
        <Route path="/beranda" element={<Beranda />} />
      </Routes>
    </Router>
  );
}

export default App;
