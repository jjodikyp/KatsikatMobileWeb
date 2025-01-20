import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import SwitchRoleKasir from '../components/SwitchRoleKasir';
import WorkTimeAlert from '../components/WorkTimeAlert';
import BreakTimeAlert from '../components/BreakTimeAlert';
import ConfirmationModal from '../components/ConfirmationModal';

const BerandaKasir = () => {
  const navigate = useNavigate();
  const [selectedEstimasi, setSelectedEstimasi] = useState("reguler");
  const [antrianData, setAntrianData] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const savedRange = localStorage.getItem("dateRange");
    if (savedRange) {
      return JSON.parse(savedRange);
    }
    const today = new Date().toISOString().split("T")[0];
    return {
      startDate: today,
      endDate: today,
    };
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Fungsi untuk memformat tanggal ke format database (YYYY-MM-DD)
  const formatDateForDB = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Handle perubahan input tanggal
  const handleDateInputChange = async (e) => {
    const { name, value } = e.target;
    const formattedValue = formatDateForDB(value);

    const newRange = {
      ...dateRange,
      [name]: formattedValue,
    };

    if (name === "startDate" && formattedValue > dateRange.endDate) {
      newRange.endDate = formattedValue;
    } else if (name === "endDate" && formattedValue < dateRange.startDate) {
      newRange.startDate = formattedValue;
    }

    setDateRange(newRange);
    localStorage.setItem("dateRange", JSON.stringify(newRange));
    await fetchAntrianData(newRange);
  };

  // Fungsi untuk mengambil data antrian
  const fetchAntrianData = async (range = dateRange) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/antrian/count`,
        {
          params: {
            startDate: formatDateForDB(range.startDate),
            endDate: formatDateForDB(range.endDate),
          },
        }
      );
      setAntrianData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAntrianData();
  }, []);

  const handleLogoutConfirm = () => {
    // Implementasi log out
  };

  const handleSwitchRoleConfirm = () => {
    // Implementasi switch role
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#E6EFF9] font-montserrat">
      <Header 
        title="CASHIER DASHBOARD"
        showLogoutButton={true}
        onLogoutClick={() => setShowLogoutModal(true)}
        showSwitchRole={true}
        onSwitchRoleClick={() => setShowSwitchRoleModal(true)}
        currentTime={currentTime}
      />
      
      {/* Main Content dengan overflow scroll */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto px-4 md:px-10 pt-20 pb-6">
          <div className="max-w-[390px] md:max-w-none mx-auto">
            <SwitchRoleKasir />
            <WorkTimeAlert />
            <BreakTimeAlert />
            
            {/* Date Range Card */}
            <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mt-4 opacity-100 outline outline-1 outline-white">
              <h2 className="text-2xl font-bebas mb-2">Date Range</h2>
              <div className="grid grid-cols-2 gap-4 font-montserrat">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">From Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateInputChange}
                    max={dateRange.endDate}
                    className="bg-[#E6EFF9] text-gray-600 shadow shadow-white opacity-100 outline outline-1 outline-white w-full p-2 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">To Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateInputChange}
                    min={dateRange.startDate}
                    className="bg-[#E6EFF9] text-gray-600 shadow shadow-white opacity-100 outline outline-1 outline-white w-full p-2 rounded-xl font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Quality Check Queue Details Card */}
            <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mt-4 opacity-100 outline outline-1 outline-white">
              <h2 className="text-2xl font-bebas mb-2">Quality Check Queue Details</h2>
              <div className="grid grid-cols-3 gap-2 font-['Montserrat']">
                <div
                  className={`${
                    selectedEstimasi === "reguler"
                      ? "bg-gradient-to-b from-[#4CA9FF] to-[#0B89FF] text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white"
                      : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                  } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                  onClick={() => setSelectedEstimasi("reguler")}
                >
                  <h3 className={selectedEstimasi === "reguler" ? "text-white" : "text-gray-600"}>
                    Regular
                  </h3>
                  <p className="text-3xl font-bold">{antrianData?.reguler || 0}</p>
                </div>
                <div
                  className={`${
                    selectedEstimasi === "sameDay"
                      ? "bg-gradient-to-b from-[#4CA9FF] to-[#0B89FF] text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white"
                      : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                  } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                  onClick={() => setSelectedEstimasi("sameDay")}
                >
                  <h3 className={selectedEstimasi === "sameDay" ? "text-white" : "text-gray-600"}>
                    Same Day
                  </h3>
                  <p className="text-3xl font-bold">{antrianData?.sameDay || 0}</p>
                </div>
                <div
                  className={`${
                    selectedEstimasi === "nextDay"
                      ? "bg-gradient-to-b from-[#4CA9FF] to-[#0B89FF] text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white"
                      : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                  } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                  onClick={() => setSelectedEstimasi("nextDay")}
                >
                  <h3 className={selectedEstimasi === "nextDay" ? "text-white" : "text-gray-600"}>
                    Next Day
                  </h3>
                  <p className="text-3xl font-bold">{antrianData?.nextDay || 0}</p>
                </div>
              </div>

              {/* Open Queue Button */}
              <button
                onClick={() =>
                  navigate(`/kasir/antrian/${selectedEstimasi}`, {
                    state: {
                      dateRange,
                      estimasi: selectedEstimasi,
                    },
                  })
                }
                className="shadow-[4px_4px_10px_rgba(0,0,0,0.15)] text-sm w-full h-[35px] mt-4 py-3 bg-[#57AEFF] text-white rounded-xl hover:bg-opacity-90 transition-all font-montserrat flex items-center justify-center font-bold outline outline-1 outline-white"
              >
                Open Queue
              </button>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout Confirmation"
        message="Are you sure you want to logout? Logging out is recommended when work hours are finished."
      />

      <ConfirmationModal
        isOpen={showSwitchRoleModal}
        onClose={() => setShowSwitchRoleModal(false)}
        onConfirm={handleSwitchRoleConfirm}
        title="Switch Role Confirmation"
        message="Are you sure you want to switch to courier page?"
      />
    </div>
  );
};

export default BerandaKasir; 