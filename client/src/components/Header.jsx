import { Twirl as Hamburger } from 'hamburger-react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmationModal from './ConfirmationModal';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData] = useState(JSON.parse(localStorage.getItem("user")));
  const [currentTime, setCurrentTime] = useState('');

  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    });
    setCurrentTime(timeString);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/absenakhir");
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto px-4 py-4 md:px-10">
          {/* Top Section */}
          <div className="flex justify-between items-center">
            {/* Logout Button and Clock Group */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-[#FD8087] transition-all shadow-2xl shadow-white opacity-100 outline outline-1 outline-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-2 outline outline-1 outline-black px-4 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="black"
                  className="w-5 h-5"
                >
                  <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" />
                  <line x1="12" y1="12" x2="12" y2="8" stroke="black" strokeWidth="2" />
                  <line x1="12" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                </svg>
                <span className="font-bebas text-xl text-[#383838]">
                  {currentTime}
                </span>
              </div>
            </div>

            {/* User Name */}
            <div className="bg-[#57AEFF] px-4 py-2 rounded-full shadow-2xl shadow-white opacity-100 outline outline-1 outline-white">
              <span className="font-bebas text-xl text-white">
                {userData?.name 
                  ? userData.name.split(' ').slice(0, 2).join(' ')
                  : "Guest"
                }
              </span>
            </div>
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar?"
      />
    </>
  );
};

export default Header; 