import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
        axios.get("http://localhost:3002/api/order-details/process/regular", {
          params: {
            startDate: newRange.startDate,
            endDate: newRange.endDate
          }
        }),
        axios.get("http://localhost:3002/api/order-details/process/same_day", {
          params: {
            startDate: newRange.startDate,
            endDate: newRange.endDate
          }
        }),
        axios.get("http://localhost:3002/api/order-details/process/next_day", {
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
      
      // Log parameter sebelum dikirim
      console.log('Sending request with params:', {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      // Pastikan parameter dikirim dengan benar
      const baseUrl = 'http://localhost:3002/api/order-details/process';
      
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

      const baseUrl = 'http://localhost:3002/api/order-details';
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
          axios.get("http://localhost:3002/api/order-details/process/regular", { params }),
          axios.get("http://localhost:3002/api/order-details/process/same_day", { params }),
          axios.get("http://localhost:3002/api/order-details/process/next_day", { params })
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

  return (
    <div className="h-screen overflow-y-auto bg-[#FFFFFF]">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex justify-between items-center max-w-[390px] md:max-w-none">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
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
        </div>
      </header>

      {/* Main Content - Adjust top padding to match header height */}
      <main className="mx-auto px-4 md:px-10 pt-24 pb-6">
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

          {/* Detail Antrian Card */}
          <div className="bg-[#F0F0F0] rounded-3xl p-4 shadow-sm sticky top-20 z-10">
            <h2 className="text-2xl font-bebas mb-2">Detail Antrian</h2>
            <div className="grid grid-cols-3 gap-2 font-['Montserrat']">
              <div
                className={`${
                  selectedEstimasi === "reguler"
                    ? "bg-[#51A7D9] text-white"
                    : "bg-[#E2E2E3] text-gray-600"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => filterTreatment("reguler")}
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
                    ? "bg-[#51A7D9] text-white"
                    : "bg-[#E2E2E3] text-gray-600"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => filterTreatment("sameDay")}
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
                    ? "bg-[#51A7D9] text-white"
                    : "bg-[#E2E2E3] text-gray-600"
                } p-4 rounded-2xl cursor-pointer hover:bg-opacity-90 transition-all`}
                onClick={() => filterTreatment("nextDay")}
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
          </div>

          {/* Antrian Treatment Section */}
          <div className="mt-4 sticky top-0 pb-2 z-10 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bebas">Antrian Treatment</h2>
            </div>
          </div>

          {/* Scrollable Treatment Cards Container */}
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-['Montserrat'] p-2">
              {Array.isArray(antrianTreatment) &&
              antrianTreatment.length > 0 ? (
                antrianTreatment.map((item) => (
                  <div key={item.id} className="bg-[#F4FBFF] rounded-2xl p-4 outline outline-2 outline-[#E3E3E3]">
                    <div className="flex items-center gap-4">
                      <div className="w-30 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        {item.shoes_photos && item.shoes_photos.length > 0 ? (
                          <img
                            src={item.shoes_photos[0].url_photo}
                            alt="Shoes"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.order?.customer?.name || "No Name"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.treatment?.name || "No Treatment"}
                        </p>
                        <p className="text-sm text-blue-500">
                          {item.process_time === "same_day"
                            ? "Same Day"
                            : item.process_time === "next_day"
                            ? "Next Day"
                            : "Regular"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 font-bold">
                          {format(new Date(item.due_date), "EEEE, dd MMMM yyyy", { locale: id })}
                        </p>
                      </div>
                    </div>
                    <button className="w-full h-[35px] mb-auto mt-6 bg-[#FFCA42] text-black rounded-xl flex items-center justify-center text-sm border border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                      Mulai Treatment
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Tidak ada antrian treatment untuk estimasi ini
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Beranda;
