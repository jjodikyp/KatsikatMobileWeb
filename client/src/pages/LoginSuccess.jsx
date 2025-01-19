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
    navigate('/pilih-role');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white px-10 sm:px-0">
      <div className="w-full sm:w-[380px] p-8 sm:p-8 my-auto bg-white rounded-3xl shadow-2xl shadow-grey opacity-100 outline outline-2 outline-white">
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <img 
            src={loginDone} 
            alt="Login Success" 
            className="w-[100px] h-auto animate-scale"
          />
        </div>

        {/* Success Message */}
        <h1 className="font-bebas text-2xl text-gray-800 tracking-wide text-center mb-3">
          ATTENDANCE SUCCESS
        </h1>

        {/* Welcome Message */}
        <p className="font-montserrat text-sm text-gray-600 text-center mb-8">
          Have a great day! Stay focused and give your best!
        </p>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="h-[40px] w-full py-3.5 px-4 shadow-xl shadow-white opacity-100 outline outline-1 outline-white text-sm bg-[#AED6FA] text-white rounded-xl font-montserrat flex items-center justify-center font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginSuccess; 