import { Twirl as Hamburger } from "hamburger-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import LordIcon from "./LordIcon";

const Header = ({
  title,
  showLogoutButton,
  onLogoutClick,
  showSwitchRole,
  onSwitchRoleClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData] = useState(JSON.parse(localStorage.getItem("user")));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (location.pathname === "/berandakurir") {
      navigate("/kurir/transport");
    } else {
      navigate("/absenakhir");
    }

    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#E6EFF9] font-montserrat">
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
                <LordIcon
                  src="https://cdn.lordicon.com/warimioc.json"
                  trigger="loop"
                  state="loop-oscillate"
                  style={{ width: "25px", height: "25px" }}
                />
                <span className="font-bebas text-xl text-[#383838]">
                  {format(currentTime, "HH:mm:ss", { locale: id })}
                </span>
              </div>
            </div>

            {/* User Name */}
            <div className="bg-[#57AEFF] px-4 py-2 rounded-full shadow-2xl shadow-white opacity-100 outline outline-1 outline-white">
              <span className="font-bebas text-xl text-white">
                {userData?.name
                  ? userData.name.split(" ").slice(0, 2).join(" ")
                  : "Guest"}
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
