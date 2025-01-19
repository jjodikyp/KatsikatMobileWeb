import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from './ConfirmationModal';
import useSound from '../hooks/useSound';
import switchSound from '../assets/sound/switch.mp3';

const SwitchRoleTeknisi = () => {
  const navigate = useNavigate();
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);
  const [showSwitchKasirModal, setShowSwitchKasirModal] = useState(false);
  const playSound = useSound();

  const handleSwitchToKurir = () => {
    playSound(switchSound);
    setShowSwitchRoleModal(true);
  };

  const handleSwitchToKasir = () => {
    playSound(switchSound);
    setShowSwitchKasirModal(true);
  };

  const handleKurirConfirm = () => {
    navigate("/berandakurir");
    setShowSwitchRoleModal(false);
  };

  const handleKasirConfirm = () => {
    navigate("/berandakasir");
    setShowSwitchKasirModal(false);
  };

  return (
    <>
      <div className="flex gap-4 max-w-[390px] mx-auto">
        {/* Kurir Button */}
        <button
          onClick={handleSwitchToKurir}
          className="flex-1 bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
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
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          <span className="font-bebas">Switch ke Kurir</span>
        </button>

        {/* Kasir Button */}
        <button
          onClick={handleSwitchToKasir}
          className="flex-1 bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
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
        isOpen={showSwitchRoleModal}
        onClose={() => setShowSwitchRoleModal(false)}
        onConfirm={handleKurirConfirm}
        title="Konfirmasi Ganti Role"
        message="Apakah Anda yakin ingin beralih ke halaman kurir?"
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

export default SwitchRoleTeknisi; 