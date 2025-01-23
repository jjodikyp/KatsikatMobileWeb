import { useNavigate } from 'react-router-dom';
import LordIcon from '../components/Design/LordIcon';
import AnimatedButton from '../components/Design/AnimatedButton';

const IzinSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Set flag bahwa user dari halaman izin
    sessionStorage.setItem('fromIzin', 'true');
    navigate('/berandateknisi');
  };
   
  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white px-10 sm:px-0">
      <div className="w-full sm:w-[380px] p-8 sm:p-8 my-auto bg-white rounded-3xl shadow-2xl shadow-grey opacity-100 outline outline-2 outline-white">
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <div className="w-[120px] h-[120px] animate-scale">
            <LordIcon
              src="https://cdn.lordicon.com/gtvaxhwv.json"
              trigger="loop"
              colors="primary:#57AEFF,secondary:#57AEFF"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="font-bebas text-2xl text-gray-800 tracking-wide text-center mb-3">
          LAPORAN IZIN BERHASIL DIKIRIM
        </h1>

        {/* Info Message */}
        <p className="font-montserrat text-sm text-gray-600 text-center mb-8">
          Laporan izin Anda telah diterima sistem. Mohon tunggu persetujuan dari admin.
        </p>

        {/* Cek Data Kinerja */}
        <AnimatedButton
          type="button"
          onClick={handleContinue}
          className="mb-2 h-[40px] w-full py-3.5 px-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white text-sm bg-[#57AEFF] text-white rounded-xl font-montserrat flex items-center justify-center font-semibold hover:bg-[#4a91d8] transition-colors"
        >
          Beranda
        </AnimatedButton>

        {/* Keluar Button */}
        <AnimatedButton
          type="button"
          onClick={() => navigate("/")}
          className="h-[40px] w-full py-3.5 px-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white text-sm bg-[#FD8087] text-white rounded-xl font-montserrat flex items-center justify-center font-semibold hover:bg-[#d86a6e] transition-colors"
        >
          Keluar
        </AnimatedButton>
      </div>
    </div>
  );
};

export default IzinSuccess; 