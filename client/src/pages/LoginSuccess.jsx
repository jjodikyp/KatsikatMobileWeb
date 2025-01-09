import { useNavigate } from 'react-router-dom';
import loginDone from '../assets/images/login.png';
import '../LoginSuccess.css';

const LoginSuccess = () => {
  const navigate = useNavigate();

  // Data dummy untuk treatment (nantinya akan diganti dengan data dari database)
  const treatmentData = {
    count: 2,
    date: "Selasa, 25 Juni 2024"
  };

  const handleContinue = () => {
    navigate('/beranda');
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-center items-center bg-white px-10 sm:px-0">
      <div className="w-full sm:w-[380px] p-6 sm:p-8 flex flex-col items-center">
        {/* Illustration */}
        <img 
          src={loginDone} 
          alt="Login Success" 
          className="w-[130px] h-auto mb-8 animate-scale"
        />

        {/* Success Message */}
        <h1 className="font-bebas text-[23px] text-gray-800 tracking-wide text-center mb-3">
          ANDA BERHASIL ABSEN
        </h1>

        {/* Welcome Message */}
        <p className="font-montserrat text-xs text-gray-600 text-center mb-8">
          Selamat bekerja! Fokus dalam bekerja dan berikan yang terbaik!
        </p>

        {/* Treatment Info */}
        <div className="w-full rounded-xl border border-gray-200 py-4 px-6 mb-6">
          <p className="font-montserrat text-xs text-center text-gray-800">
            Anda perlu menyelesaikan {treatmentData.count} treatment yang belum selesai sejak{' '}
            <span className="font-semibold">{treatmentData.date}</span>
          </p>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 px-4 bg-[#51A7D9] hover:bg-[#2F82B2] active:bg-[#2F82B2] text-white font-montserrat rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 text-xs"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
};

export default LoginSuccess; 