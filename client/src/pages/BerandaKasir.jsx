import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import SwitchRoleKasir from '../components/SwitchRoleKasir';
import WorkTimeAlert from '../components/WorkTimeAlert';
import BreakTimeAlert from '../components/BreakTimeAlert';

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

  return (
    <div className="h-screen overflow-y-auto bg-[#FFFFFF] font-montserrat">
      <Header />
      
      {/* Main Content */}
      <main className="mx-auto px-4 md:px-10 pt-20 pb-6 min-h-screen">
        <div className="max-w-[390px] md:max-w-none mx-auto">
          <SwitchRoleKasir />
          <WorkTimeAlert />
          <BreakTimeAlert />
          
          {/* Date Range Picker */}
          <div className="mb-2 bg-[#F0F0F0] rounded-3xl p-4 shadow-sm mt-4">
            <h2 className="text-2xl font-bebas mb-3">Rentang Waktu</h2>
            <div className="grid grid-cols-2 gap-4 font-montserrat">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateInputChange}
                  max={dateRange.endDate}
                  className="w-full p-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateInputChange}
                  min={dateRange.startDate}
                  className="w-full p-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Detail Antrian Card */}
          <div className="bg-[#F0F0F0] rounded-3xl p-4 shadow-sm mt-4 mb-2">
            <h2 className="text-2xl font-bebas mb-2">Detail Antrian Quality Check</h2>
            <div className="grid grid-cols-3 gap-2 font-['Montserrat']">
              <div
                className={`${
                  selectedEstimasi === "reguler"
                    ? "bg-[#51A7D9] text-white"
                    : "bg-[#E2E2E3] text-gray-600"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => setSelectedEstimasi("reguler")}
              >
                <h3 className={selectedEstimasi === "reguler" ? "text-white" : "text-gray-600"}>
                  Reguler
                </h3>
                <p className="text-3xl font-bold">{antrianData?.reguler || 0}</p>
              </div>
              <div
                className={`${
                  selectedEstimasi === "sameDay"
                    ? "bg-[#51A7D9] text-white"
                    : "bg-[#E2E2E3] text-gray-600"
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
                    ? "bg-[#51A7D9] text-white"
                    : "bg-[#E2E2E3] text-gray-600"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => setSelectedEstimasi("nextDay")}
              >
                <h3 className={selectedEstimasi === "nextDay" ? "text-white" : "text-gray-600"}>
                  Next Day
                </h3>
                <p className="text-3xl font-bold">{antrianData?.nextDay || 0}</p>
              </div>
            </div>

            {/* Button Buka Antrian */}
            <button
              onClick={() =>
                navigate(`/kasir/antrian/${selectedEstimasi}`, {
                  state: {
                    dateRange,
                    estimasi: selectedEstimasi,
                  },
                })
              }
              className="shadow-xl text-sm w-full h-[35px] mt-4 py-3 bg-[#FFCA42] text-white rounded-xl hover:bg-opacity-90 transition-all font-montserrat flex items-center justify-center font-bold"
            >
              Buka Antrian
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BerandaKasir; 