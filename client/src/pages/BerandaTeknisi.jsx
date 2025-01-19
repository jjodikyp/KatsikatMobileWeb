import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  format,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import ConfirmationModal from "../components/ConfirmationModal";
import Header from "../components/Header";
import SwitchRoleTeknisi from '../components/SwitchRoleTeknisi';
import WorkTimeAlert from '../components/WorkTimeAlert';
import BreakTimeAlert from '../components/BreakTimeAlert';

const BerandaTeknisi = () => {
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
  const [showOvertimeWarning, setShowOvertimeWarning] = useState(false);
  const [canTakeOvertime, setCanTakeOvertime] = useState(false);
  const [workDuration, setWorkDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showBreakWarning, setShowBreakWarning] = useState(false);
  const [showReturnWarning, setShowReturnWarning] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [returnCountdown, setReturnCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentTime, setCurrentTime] = useState('');

  // Fungsi untuk mendapatkan waktu WIB
  const getJakartaTime = () => {
    const date = new Date();
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  };

  // Fungsi untuk testing waktu
  const debugTime = (targetHour, targetMinute) => {
    const testTime = new Date();
    testTime.setHours(targetHour);
    testTime.setMinutes(targetMinute);
    testTime.setSeconds(0);
    
    // Override getJakartaTime untuk testing
    getJakartaTime = () => testTime;
    
    console.log(`Testing dengan waktu: ${format(testTime, 'HH:mm:ss')}`);
  };

  // Fungsi untuk mengecek waktu istirahat
  const checkBreakTime = () => {
    const jakartaTime = getJakartaTime();
    
    // Hanya log saat pertama kali komponen dimount atau saat debug
    // console.log('Current Jakarta time:', format(jakartaTime, 'HH:mm:ss'));

    // Set target times
    const breakTime = setHours(setMinutes(setSeconds(jakartaTime, 0), 0), 12); // 12:00:00
    const warningTime = setHours(setMinutes(setSeconds(jakartaTime, 0), 45), 11); // 11:45:00
    const returnTime = setHours(setMinutes(setSeconds(jakartaTime, 0), 0), 13); // 13:00:00

    // Hitung countdown ke waktu istirahat
    if (jakartaTime < breakTime) {
      const diff = breakTime.getTime() - jakartaTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setBreakCountdown({ hours, minutes, seconds });
    }

    // Hitung countdown ke waktu kembali
    if (jakartaTime >= breakTime && jakartaTime < returnTime) {
      const diff = returnTime.getTime() - jakartaTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setReturnCountdown({ hours, minutes, seconds });
    }

    // Tampilkan peringatan 15 menit sebelum istirahat
    if (jakartaTime >= warningTime && jakartaTime < breakTime) {
      setShowBreakWarning(true);
      setShowReturnWarning(false);
      // console.log('Break warning shown');
    } 
    // Tampilkan peringatan selama waktu istirahat
    else if (jakartaTime >= breakTime && jakartaTime < returnTime) {
      setShowBreakWarning(false);
      setShowReturnWarning(true);
      // console.log('Return warning shown');
    } 
    // Sembunyikan semua peringatan
    else {
      setShowBreakWarning(false);
      setShowReturnWarning(false);
    }
  };

  // Jalankan pengecekan waktu istirahat setiap detik
  useEffect(() => {
    checkBreakTime();
    const interval = setInterval(checkBreakTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

      return dueDate >= startDate && dueDate <= endDate;
    });
  };

  // Handle perubahan input tanggal dengan auto-refresh
  const handleDateInputChange = async (e) => {
    const { name, value } = e.target;
    const formattedValue = formatDateForDB(value);

    const newRange = {
      ...dateRange,
      [name]: formattedValue,
    };

    // Validasi rentang
    if (name === "startDate" && formattedValue > dateRange.endDate) {
      newRange.endDate = formattedValue;
    } else if (name === "endDate" && formattedValue < dateRange.startDate) {
      newRange.startDate = formattedValue;
    }

    console.log("New date range:", newRange);

    // Update dateRange dan localStorage
    setDateRange(newRange);
    localStorage.setItem("dateRange", JSON.stringify(newRange));

    try {
      console.log("Fetching data with new date range...");
      const [regularResponse, sameDayResponse, nextDayResponse] =
        await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/order-details/process/regular`,
            {
              params: {
                startDate: newRange.startDate,
                endDate: newRange.endDate,
              },
            }
          ),
          axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/order-details/process/same_day`,
            {
              params: {
                startDate: newRange.startDate,
                endDate: newRange.endDate,
              },
            }
          ),
          axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/order-details/process/next_day`,
            {
              params: {
                startDate: newRange.startDate,
                endDate: newRange.endDate,
              },
            }
          ),
        ]);

      const regularFiltered = filterByDateRange(
        regularResponse.data.data || []
      );
      const sameDayFiltered = filterByDateRange(
        sameDayResponse.data.data || []
      );
      const nextDayFiltered = filterByDateRange(
        nextDayResponse.data.data || []
      );

      console.log("Filtered data:", {
        regular: regularFiltered.length,
        sameDay: sameDayFiltered.length,
        nextDay: nextDayFiltered.length,
      });

      setAntrianData({
        reguler: regularFiltered.length,
        sameDay: sameDayFiltered.length,
        nextDay: nextDayFiltered.length,
      });

      // Update antrian treatment sesuai filter yang aktif
      if (selectedEstimasi === "reguler") {
        console.log("Setting antrian reguler:", regularFiltered);
        setAntrianTreatment(regularFiltered);
      } else if (selectedEstimasi === "sameDay") {
        console.log("Setting antrian same day:", sameDayFiltered);
        setAntrianTreatment(sameDayFiltered);
      } else if (selectedEstimasi === "nextDay") {
        console.log("Setting antrian next day:", nextDayFiltered);
        setAntrianTreatment(nextDayFiltered);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      // Log detail error
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
    }
  };

  // Modifikasi fetchAntrianData untuk menerima parameter rentang tanggal
  const fetchAntrianData = async (range = dateRange) => {
    try {
      const formattedStartDate = formatDateForDB(range.startDate);
      const formattedEndDate = formatDateForDB(range.endDate);

      console.log("Sending request with params:", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      // Gunakan VITE_API_URL dari env
      const baseUrl = `${
        import.meta.env.VITE_API_URL
      }/api/order-details/process`;

      const [regularResponse, sameDayResponse, nextDayResponse] =
        await Promise.all([
          axios.get(`${baseUrl}/regular`, {
            params: {
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            },
          }),
          axios.get(`${baseUrl}/same_day`, {
            params: {
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            },
          }),
          axios.get(`${baseUrl}/next_day`, {
            params: {
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            },
          }),
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
        status: error.response?.status,
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

      if (estimasi === "all") {
        response = await axios.get(baseUrl, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        });
      } else {
        const processTime =
          estimasi === "sameDay"
            ? "same_day"
            : estimasi === "nextDay"
            ? "next_day"
            : "regular";
        response = await axios.get(`${baseUrl}/process/${processTime}`, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
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
        console.log("Original date range:", dateRange);

        // Format tanggal
        const formattedStartDate = formatDateForDB(dateRange.startDate);
        const formattedEndDate = formatDateForDB(dateRange.endDate);

        // Log tanggal setelah format
        console.log("Formatted dates:", {
          formattedStartDate,
          formattedEndDate,
        });

        const params = {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };

        // Log full request details
        console.log("Making requests with:", {
          url: "http://localhost:3002/api/order-details/process/regular",
          params,
        });

        const [regularResponse, sameDayResponse, nextDayResponse] =
          await Promise.all([
            axios.get(
              `${
                import.meta.env.VITE_API_URL
              }/api/order-details/process/regular`,
              { params }
            ),
            axios.get(
              `${
                import.meta.env.VITE_API_URL
              }/api/order-details/process/same_day`,
              { params }
            ),
            axios.get(
              `${
                import.meta.env.VITE_API_URL
              }/api/order-details/process/next_day`,
              { params }
            ),
          ]);

        // Log responses
        console.log("Responses received:", {
          regular: regularResponse.data,
          sameDay: sameDayResponse.data,
          nextDay: nextDayResponse.data,
        });

        const regularFiltered = filterByDateRange(
          regularResponse.data.data || []
        );
        const sameDayFiltered = filterByDateRange(
          sameDayResponse.data.data || []
        );
        const nextDayFiltered = filterByDateRange(
          nextDayResponse.data.data || []
        );

        setAntrianData({
          reguler: regularFiltered.length,
          sameDay: sameDayFiltered.length,
          nextDay: nextDayFiltered.length,
        });

        if (selectedEstimasi === "reguler")
          setAntrianTreatment(regularFiltered);
        else if (selectedEstimasi === "sameDay")
          setAntrianTreatment(sameDayFiltered);
        else if (selectedEstimasi === "nextDay")
          setAntrianTreatment(nextDayFiltered);
      } catch (error) {
        // Detailed error logging
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config, // This will show what was actually sent
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
    navigate("/absenakhir");
    setShowLogoutModal(false);
  };

  const handleSwitchRoleConfirm = () => {
    navigate("/kurir/transport");
    setShowSwitchRoleModal(false);
  };

  // Tambahkan fungsi untuk update waktu
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

  // Tambahkan useEffect untuk update waktu setiap detik
  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#E6EFF9] font-montserrat">
      <Header />
      
      {/* Main Content */}
      <main className="mx-auto px-4 md:px-10 pt-20 pb-6 min-h-screen">
        <div className="max-w-[390px] md:max-w-none mx-auto">
          <SwitchRoleTeknisi />
          <WorkTimeAlert />
          <BreakTimeAlert />
          
          {/* Date Range Picker */}
          <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-2xl mt-4 shadow-white opacity-100 outline outline-1 outline-white">
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
                  className="bg-[#E6EFF9] text-gray-600 shadow shadow-white opacity-100 outline outline-1 outline-white w-full p-2 rounded-xl font-semibold"
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
                  className="bg-[#E6EFF9] text-gray-600 shadow shadow-white opacity-100 outline outline-1 outline-white w-full p-2 rounded-xl font-semibold"
                />
              </div>
            </div>  
          </div>

          {/* Detail Antrian Card dengan Button Buka Antrian */}
          <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-2xl mt-4 shadow-white opacity-100 outline outline-1 outline-white">
            <h2 className="text-2xl font-bebas mb-2">Detail Antrian Treatment</h2>
            <div className="grid grid-cols-3 gap-2 font-['Montserrat']">
              <div
                className={`${
                  selectedEstimasi === "reguler"
                    ? "bg-gradient-to-b from-[#4CA9FF] to-[#0B89FF] text-white shadow-2xl shadow-white opacity-100 outline outline-1 outline-white"
                    : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => setSelectedEstimasi("reguler")}
              >
                <h3
                  className={
                    selectedEstimasi === "reguler"
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  Reguler
                </h3>
                <p className="text-3xl font-bold">
                  {antrianData?.reguler || 0}
                </p>
              </div>
              <div
                className={`${
                  selectedEstimasi === "sameDay"
                    ? "bg-gradient-to-b from-[#4CA9FF] to-[#0B89FF] text-white shadow-2xl shadow-white opacity-100 outline outline-1 outline-white"
                    : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => setSelectedEstimasi("sameDay")}
              >
                <h3
                  className={
                    selectedEstimasi === "sameDay"
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  Same Day
                </h3>
                <p className="text-3xl font-bold">
                  {antrianData?.sameDay || 0}
                </p>
              </div>
              <div
                className={`${
                  selectedEstimasi === "nextDay"
                    ? "bg-gradient-to-b from-[#4CA9FF] to-[#0B89FF] text-white shadow-2xl shadow-white opacity-100 outline outline-1 outline-white"
                    : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => setSelectedEstimasi("nextDay")}
              >
                <h3
                  className={
                    selectedEstimasi === "nextDay"
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  Next Day
                </h3>
                <p className="text-3xl font-bold">
                  {antrianData?.nextDay || 0}
                </p>
              </div>
            </div>

            {/* Button Buka Antrian */}
            <button
              onClick={() =>
                navigate(`/antrian/${selectedEstimasi}`, {
                  state: {
                    dateRange,
                    estimasi: selectedEstimasi,
                  },
                })
              }
              className="shadow-xl shadow-white opacity-100 outline outline-1 outline-white text-sm w-full h-[35px] mt-4 py-3 bg-[#AED6FA] text-white rounded-xl hover:bg-opacity-90 transition-al font-montserrat flex items-center justify-center font-bold"
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

export default BerandaTeknisi;
