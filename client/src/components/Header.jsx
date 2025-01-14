import { Twirl as Hamburger } from 'hamburger-react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmationModal from './ConfirmationModal';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);
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

  const handleSwitchRoleConfirm = () => {
    navigate("/kurir/transport");
    setShowSwitchRoleModal(false);
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
                className="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-[#FD8087] transition-all"
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
            <div className="bg-[#F0F0F0] px-4 py-2 rounded-full">
              <span className="font-bebas text-xl text-[#383838]">
                {userData?.name 
                  ? userData.name.split(' ').slice(0, 2).join(' ')
                  : "Guest"
                }
              </span>
            </div>
          </div>

          {/* Bottom Section - Role Switches */}
          <div className="flex gap-4 mt-4 max-w-[390px] mx-auto">
            {/* Kurir Button */}
            <button
              onClick={() => setShowSwitchRoleModal(true)}
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

            {/* Kasir Button */}
            <button
              onClick={() => navigate('/kasir')}
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
        </div>
      </header>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar?"
      />

      <ConfirmationModal
        isOpen={showSwitchRoleModal}
        onClose={() => setShowSwitchRoleModal(false)}
        onConfirm={handleSwitchRoleConfirm}
        title="Konfirmasi Ganti Role"
        message="Apakah Anda yakin ingin beralih ke halaman kurir?"
      />
    </>
  );
};

export default Header; 