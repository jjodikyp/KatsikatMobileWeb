import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from './ConfirmationModal';
import useSound from '../hooks/useSound';
import switchSound from '../assets/sound/switch.mp3';

const SwitchRoleKurir = () => {
  const navigate = useNavigate();
  const [showSwitchTeknisiModal, setShowSwitchTeknisiModal] = useState(false);
  const [showSwitchKasirModal, setShowSwitchKasirModal] = useState(false);
  const playSound = useSound();

  const handleSwitchToTeknisi = () => {
    playSound(switchSound);
    setShowSwitchTeknisiModal(true);
  };

  const handleSwitchToKasir = () => {
    playSound(switchSound);
    setShowSwitchKasirModal(true);
  };

  const handleTeknisiConfirm = () => {
    navigate("/beranda");
    setShowSwitchTeknisiModal(false);
  };

  const handleKasirConfirm = () => {
    navigate("/berandakasir");
    setShowSwitchKasirModal(false);
  };

  return (
    <>
      <div className="flex gap-4 max-w-[390px] mx-auto">
        {/* Teknisi Button */}
        <button
          onClick={handleSwitchToTeknisi}
          className="flex-1 bg-black hover:bg-opacity-90 text-white py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
            />
          </svg>
          <span className="font-bebas">Switch ke Teknisi</span>
        </button>

        {/* Kasir Button */}
        <button
          onClick={handleSwitchToKasir}
          className="flex-1 bg-black hover:bg-opacity-90 text-white py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
            />
          </svg>
          <span className="font-bebas">Switch ke Kasir</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={showSwitchTeknisiModal}
        onClose={() => setShowSwitchTeknisiModal(false)}
        onConfirm={handleTeknisiConfirm}
        title="Konfirmasi Ganti Role"
        message="Apakah Anda yakin ingin beralih ke halaman teknisi?"
      />

      <ConfirmationModal
        isOpen={showSwitchKasirModal}
        onClose={() => setShowSwitchKasirModal(false)}
        onConfirm={handleKasirConfirm}
        title="Konfirmasi Ganti Role"
        message="Apakah Anda yakin ingin beralih ke halaman kasir?"
      />
    </>
  );
};

export default SwitchRoleKurir; 