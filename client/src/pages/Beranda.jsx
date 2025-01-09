import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ConfirmationModal from '../components/ConfirmationModal';

const Beranda = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedEstimasi, setSelectedEstimasi] = useState("reguler");
  const [antrianData, setAntrianData] = useState(null);
  const [antrianTreatment, setAntrianTreatment] = useState([]);
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
  const [tempDateRange, setTempDateRange] = useState(() => {
    const savedRange = localStorage.getItem('dateRange');
    if (savedRange) {
      return JSON.parse(savedRange);
    }
    const today = new Date().toISOString().split('T')[0];
    return {
      startDate: today,
      endDate: today
    };
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);

  // Fungsi untuk memformat tanggal ke format database (YYYY-MM-DD)
  const formatDateForDB = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Fungsi untuk memfilter data berdasarkan rentang tanggal
  const filterByDateRange = (data) => {
    return data.filter((item) => {
      const dueDate = new Date(item.due_date).toISOString().split("T")[0];
      const startDate = formatDateForDB(dateRange.startDate);
      const endDate = formatDateForDB(dateRange.endDate);

      console.log("Comparing dates:", {
        dueDate,
        startDate,
        endDate,
        isInRange: dueDate >= startDate && dueDate <= endDate,
      });

      return dueDate >= startDate && dueDate <= endDate;
    });
  };

  // Handle perubahan input tanggal dengan auto-refresh
  const handleDateInputChange = async (e) => {
    const { name, value } = e.target;
    const formattedValue = formatDateForDB(value);

    const newRange = {
      ...dateRange,
      [name]: formattedValue
    };

    // Validasi rentang
    if (name === 'startDate' && formattedValue > dateRange.endDate) {
      newRange.endDate = formattedValue;
    } else if (name === 'endDate' && formattedValue < dateRange.startDate) {
      newRange.startDate = formattedValue;
    }

    console.log('New date range:', newRange);
    
    // Update dateRange dan localStorage
    setDateRange(newRange);
    localStorage.setItem('dateRange', JSON.stringify(newRange));

    try {
      console.log('Fetching data with new date range...');
      const [regularResponse, sameDayResponse, nextDayResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/regular`, {
          params: {
            startDate: newRange.startDate,
            endDate: newRange.endDate
          }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/same_day`, {
          params: {
            startDate: newRange.startDate,
            endDate: newRange.endDate
          }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/next_day`, {
          params: {
            startDate: newRange.startDate,
            endDate: newRange.endDate
          }
        })
      ]);

      const regularFiltered = filterByDateRange(regularResponse.data.data || []);
      const sameDayFiltered = filterByDateRange(sameDayResponse.data.data || []);
      const nextDayFiltered = filterByDateRange(nextDayResponse.data.data || []);

      console.log('Filtered data:', {
        regular: regularFiltered.length,
        sameDay: sameDayFiltered.length,
        nextDay: nextDayFiltered.length
      });

      setAntrianData({
        reguler: regularFiltered.length,
        sameDay: sameDayFiltered.length,
        nextDay: nextDayFiltered.length,
      });

      // Update antrian treatment sesuai filter yang aktif
      if (selectedEstimasi === 'reguler') {
        console.log('Setting antrian reguler:', regularFiltered);
        setAntrianTreatment(regularFiltered);
      } else if (selectedEstimasi === 'sameDay') {
        console.log('Setting antrian same day:', sameDayFiltered);
        setAntrianTreatment(sameDayFiltered);
      } else if (selectedEstimasi === 'nextDay') {
        console.log('Setting antrian next day:', nextDayFiltered);
        setAntrianTreatment(nextDayFiltered);
      }

    } catch (error) {
      console.error("Error updating data:", error);
      // Log detail error
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
    }
  };

  // Modifikasi fetchAntrianData untuk menerima parameter rentang tanggal
  const fetchAntrianData = async (range = dateRange) => {
    try {
      const formattedStartDate = formatDateForDB(range.startDate);
      const formattedEndDate = formatDateForDB(range.endDate);
      
      console.log('Sending request with params:', {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      // Gunakan VITE_API_URL dari env
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/order-details/process`;
      
      const [regularResponse, sameDayResponse, nextDayResponse] = await Promise.all([
        axios.get(`${baseUrl}/regular`, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        }),
        axios.get(`${baseUrl}/same_day`, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        }),
        axios.get(`${baseUrl}/next_day`, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        })
      ]);

      setAntrianData({
        reguler: regularResponse.data.data.length,
        sameDay: sameDayResponse.data.data.length,
        nextDay: nextDayResponse.data.data.length,
      });

      // Set antrian treatment sesuai filter yang aktif
      if (selectedEstimasi === "reguler")
        setAntrianTreatment(regularResponse.data.data);
      else if (selectedEstimasi === "sameDay")
        setAntrianTreatment(sameDayResponse.data.data);
      else if (selectedEstimasi === "nextDay")
        setAntrianTreatment(nextDayResponse.data.data);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Tambahkan log detail error
      console.error("Error response:", error.response?.data);
    }
  };

  useEffect(() => {
    console.log("Page reloaded");
  }, []);

  useEffect(() => {
    fetchAntrianData();
  }, [navigate]);

  // Debug state changes
  useEffect(() => {
    console.log("Current antrianData:", antrianData);
  }, [antrianData]);

  // Ubah fungsi filterTreatment
  const filterTreatment = async (estimasi) => {
    setSelectedEstimasi(estimasi);
    try {
      const formattedStartDate = formatDateForDB(dateRange.startDate);
      const formattedEndDate = formatDateForDB(dateRange.endDate);

      const baseUrl = `${import.meta.env.VITE_API_URL}/api/order-details`;
      let response;
      
      if (estimasi === 'all') {
        response = await axios.get(baseUrl, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        });
      } else {
        const processTime = estimasi === 'sameDay' ? 'same_day' : 
                           estimasi === 'nextDay' ? 'next_day' : 
                           'regular';
        response = await axios.get(`${baseUrl}/process/${processTime}`, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        });
      }
      
      setAntrianTreatment(response.data.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setAntrianTreatment([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Tambahkan useEffect untuk memantau perubahan dateRange
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Log tanggal sebelum format
        console.log('Original date range:', dateRange);

        // Format tanggal
        const formattedStartDate = formatDateForDB(dateRange.startDate);
        const formattedEndDate = formatDateForDB(dateRange.endDate);

        // Log tanggal setelah format
        console.log('Formatted dates:', {
          formattedStartDate,
          formattedEndDate
        });

        const params = {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        };

        // Log full request details
        console.log('Making requests with:', {
          url: 'http://localhost:3002/api/order-details/process/regular',
          params
        });

        const [regularResponse, sameDayResponse, nextDayResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/regular`, { params }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/same_day`, { params }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/next_day`, { params })
        ]);

        // Log responses
        console.log('Responses received:', {
          regular: regularResponse.data,
          sameDay: sameDayResponse.data,
          nextDay: nextDayResponse.data
        });

        const regularFiltered = filterByDateRange(regularResponse.data.data || []);
        const sameDayFiltered = filterByDateRange(sameDayResponse.data.data || []);
        const nextDayFiltered = filterByDateRange(nextDayResponse.data.data || []);

        setAntrianData({
          reguler: regularFiltered.length,
          sameDay: sameDayFiltered.length,
          nextDay: nextDayFiltered.length,
        });

        if (selectedEstimasi === 'reguler') setAntrianTreatment(regularFiltered);
        else if (selectedEstimasi === 'sameDay') setAntrianTreatment(sameDayFiltered);
        else if (selectedEstimasi === 'nextDay') setAntrianTreatment(nextDayFiltered);

      } catch (error) {
        // Detailed error logging
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config // This will show what was actually sent
        });
      }
    };

    fetchData();
  }, [dateRange, selectedEstimasi]);

  // Tambahkan useEffect untuk mengambil data user
  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      const parsedUserData = JSON.parse(userDataFromStorage);
      setUserData(parsedUserData);
      console.log("User data loaded:", parsedUserData); // untuk debugging
    }
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setShowLogoutModal(false);
  };

  const handleSwitchRoleConfirm = () => {
    navigate("/kurir/transport");
    setShowSwitchRoleModal(false);
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#FFFFFF] font-montserrat">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex justify-between items-center max-w-[390px] md:max-w-none">
          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-[#FD8087] hover:bg-opacity-90 transition-all"
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

          {/* User Profile Area */}
          <div className="flex items-center gap-4 bg-[#F0F0F0] px-4 py-2 rounded-full">
            <span className="font-bebas text-xl color-[#383838]">
              {userData?.name 
                ? userData.name.split(' ').slice(0, 2).join(' ')
                : "Guest"
              }
            </span>
            <div className="w-[33px] h-[33px] rounded-full bg-gray-300 overflow-hidden">
              {userData?.photo ? (
                <img
                  src={userData.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
          </div>

          {/* Switch Role Button */}
          <button
            onClick={() => setShowSwitchRoleModal(true)}
            className="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-[#51A7D9] hover:bg-opacity-90 transition-all"
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
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 md:px-10 pt-24 pb-6 min-h-screen">
        <div className="max-w-[390px] md:max-w-none mx-auto">
          {/* Date Range Picker */}
          <div className="mb-4 bg-[#F0F0F0] rounded-3xl p-4 shadow-sm">
            <h2 className="text-2xl font-bebas mb-3">Rentang Waktu</h2>
            <div className="grid grid-cols-2 gap-4 font-montserrat">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Dari Tanggal</label>
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
                <label className="block text-sm text-gray-600 mb-1">Sampai Tanggal</label>
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

          {/* Detail Antrian Card dengan Button Buka Antrian */}
          <div className="bg-[#F0F0F0] rounded-3xl p-4 shadow-sm">
            <h2 className="text-2xl font-bebas mb-2">Detail Antrian</h2>
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
              onClick={() => navigate(`/antrian/${selectedEstimasi}`, { 
                state: { 
                  dateRange,
                  estimasi: selectedEstimasi 
                }
              })}
              className="w-full mt-4 py-3 bg-[#FFCA42] text-white rounded-xl font-medium hover:bg-opacity-90 transition-al font-montserrat"
            >
              Buka Antrian
            </button>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar? Keluar dari aplikasi direkomendasikan saat jam kerja sudah selesai."
      />

      <ConfirmationModal
        isOpen={showSwitchRoleModal}
        onClose={() => setShowSwitchRoleModal(false)}
        onConfirm={handleSwitchRoleConfirm}
        title="Konfirmasi Ganti Role"
        message="Apakah Anda yakin ingin beralih ke halaman kurir?"
      />
    </div>
  );
};

export default Beranda;
