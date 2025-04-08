import { useState } from 'react';
import Modal from "../Modal/SwitchModal";
import SwitchRole from "./SwitchRole";

const LogoutButton = ({ onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTitleByPath = () => {
    const path = location.pathname;

    if (path.includes("berandakasir")) {
      return "Kasir";
    } else if (path.includes("berandakurir")) {
      return "Kurir";
    } else if (path.includes("berandateknisi")) {
      return "Teknisi";
    }
    return null;
  };

  const title = getTitleByPath();

  // Jika title tidak ada judul page, return null
  if (!title) return null;

  return (
    <>
      <div className="w-full h-[41px] p-4 rounded-full flex items-center justify-center bg-white transition-all shadow-2xl shadow-white opacity-100 gap-2 font-bebas text-xl text-[#3F3F3F] outline outline-2 outline-[#EEF1F7]">
        <button
          onClick={onClick}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#FD8087"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </button>
        <span className="font-bebas text-xl text-[#EEF1F7]">
          |
        </span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xl"
        >
          {title}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pilih peran anda"
      >
        <div className="mt-4 mb-2">
          <SwitchRole />
        </div>
      </Modal>
    </>
  );
};

export default LogoutButton;
