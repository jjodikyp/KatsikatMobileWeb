import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from './ConfirmationModal';
import useSound from '../hooks/useSound';
import switchSound from '../assets/sound/switch.mp3';

const SwitchRoleKasir = () => {
  const navigate = useNavigate();
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);
  const [showSwitchKurirModal, setShowSwitchKurirModal] = useState(false);
  const playSound = useSound();

  const handleSwitchToTeknisi = () => {
    playSound(switchSound);
    setShowSwitchRoleModal(true);
  };

  const handleSwitchToKurir = () => {
    playSound(switchSound);
    setShowSwitchKurirModal(true);
  };

  const handleTeknisiConfirm = () => {
    navigate("/berandateknisi");
    setShowSwitchRoleModal(false);
  };

  const handleKurirConfirm = () => {
    navigate("/berandakurir");
    setShowSwitchKurirModal(false);
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

        {/* Kurir Button */}
        <button
          onClick={handleSwitchToKurir}
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
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          <span className="font-bebas">Switch ke Kurir</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={showSwitchRoleModal}
        onClose={() => setShowSwitchRoleModal(false)}
        onConfirm={handleTeknisiConfirm}
        title="Konfirmasi Ganti Role"
        message="Apakah Anda yakin ingin beralih ke halaman teknisi?"
      />

      <ConfirmationModal
        isOpen={showSwitchKurirModal}
        onClose={() => setShowSwitchKurirModal(false)}
        onConfirm={handleKurirConfirm}
        title="Konfirmasi Ganti Role"
        message="Apakah Anda yakin ingin beralih ke halaman kurir?"
      />
    </>
  );
};

export default SwitchRoleKasir; 