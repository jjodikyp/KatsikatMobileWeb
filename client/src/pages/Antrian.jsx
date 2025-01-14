import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const Antrian = () => {
  const navigate = useNavigate();
  const { estimasi } = useParams();
  const location = useLocation();
  const { dateRange } = location.state || {};

  const [userData, setUserData] = useState(null);
  const [antrianTreatment, setAntrianTreatment] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("cleaning");
  const [cleaningCount, setCleaningCount] = useState(0);
  const [repairCount, setRepairCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
    }

    fetchAntrianData();
    fetchAntrianCounts();
  }, [selectedFilter, dateRange, estimasi]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const fetchAntrianData = async () => {
    try {
      const processTime =
        estimasi === "sameDay"
          ? "same_day"
          : estimasi === "nextDay"
          ? "next_day"
          : "regular";

      console.log("Fetching data with params:", {
        processTime,
        serviceType: selectedFilter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/order-details/process/${processTime}`,
        {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            serviceType: selectedFilter,
          },
        }
      );

      console.log("Response data:", response.data);
      setAntrianTreatment(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAntrianCounts = async () => {
    try {
      const processTime = estimasi === "sameDay" ? "same_day" : estimasi === "nextDay" ? "next_day" : "regular";
      
      // Fetch cleaning count
      const cleaningResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/${processTime}`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          serviceType: 'cleaning',
        },
      });
      setCleaningCount(cleaningResponse.data.data.length);

      // Fetch repair count
      const repairResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/order-details/process/${processTime}`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          serviceType: 'repair',
        },
      });
      setRepairCount(repairResponse.data.data.length);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter === selectedFilter ? filter : filter);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#FFFFFF] font-montserrat">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white">
        <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex justify-between items-center max-w-[390px] md:max-w-none">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* User Profile Area */}
          <div className="flex items-center gap-4 bg-[#F0F0F0] px-4 py-2 rounded-full">
            <span className="font-bebas text-xl color-[#383838]">
              {userData?.name
                ? userData.name.split(" ").slice(0, 2).join(" ")
                : "Guest"}
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

        {/* Filter Section */}
        <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex justify-between items-center max-w-[390px] md:max-w-none bg-white shadow-lg">
          <h1 className="text-2xl font-bebas">
            {" "}
            {estimasi === "sameDay"
              ? "Same Day"
              : estimasi === "nextDay"
              ? "Next Day"
              : "Regular"}
          </h1>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => handleFilterChange("cleaning")}
                className={`ml-4 px-4 py-2 rounded-lg transition-all ${
                  selectedFilter === "cleaning"
                    ? "bg-[#51A7D9] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Cleaning
              </button>
              {cleaningCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#FD8087] text-white rounded-full w-6 h-6 flex items-center justify-center font-montserrat text-xs">
                  {cleaningCount}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => handleFilterChange("repair")}
                className={`ml-2 px-4 py-2 rounded-lg transition-all ${
                  selectedFilter === "repair"
                    ? "bg-[#51A7D9] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Repair
              </button>
              {repairCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#FD8087] text-white rounded-full w-6 h-6 flex items-center justify-center font-montserrat text-xs">
                  {repairCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Dengan padding top yang disesuaikan */}
      <main className="mx-auto px-4 md:px-10 pt-[170px] pb-6">
        <div className="max-w-[390px] md:max-w-none mx-auto">
          {/* Treatment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {antrianTreatment.length > 0 ? (
              antrianTreatment.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F4FBFF] rounded-2xl p-4 outline outline-2 outline-[#E3E3E3]"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-[100px] h-[100px] min-w-[100px] bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer"
                      onClick={() => {
                        if (item.shoes_photos && item.shoes_photos.length > 0) {
                          setSelectedImage(item.shoes_photos[0].url_photo);
                          setShowModal(true);
                        }
                      }}
                    >
                      {item.shoes_photos && item.shoes_photos.length > 0 ? (
                        <img
                          src={item.shoes_photos[0].url_photo}
                          alt="Shoes"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-md md:text-base truncate">
                        {item.order?.customer?.name || "No Name"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {item.treatment?.name || "No Treatment"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 text-[#AA3328]">
                        {item.description || "Tidak ada keterangan"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-2 font-bold">
                        {format(new Date(item.due_date), "EEEE, dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                  <button className="w-full h-[35px] mb-auto mt-4 bg-[#FFCA42] text-white rounded-xl flex items-center justify-center text-sm shadow-md font-bold">
                    Mulai Treatment
                  </button>
                </div>
              ))
            ) : ( 
              <div className="col-span-full text-center py-8 text-gray-500">
                Tidak ada antrian treatment untuk kategori {selectedFilter}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Image Preview Modal dengan animasi yang sama dengan ConfirmationModal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay dengan animasi fade */}
            <div 
              className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                showModal ? 'bg-opacity-75' : 'bg-opacity-0'
              }`}
              aria-hidden="true"
              onClick={() => {
                setShowModal(false);
                setSelectedImage(null);
              }}
            />

            {/* Modal container untuk centering */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal content dengan animasi */}
            <div 
              className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-3xl w-full
                ${showModal ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}`}
            >
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                <div className="p-4 bg-white flex justify-center">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedImage(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-montserrat"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Antrian;
