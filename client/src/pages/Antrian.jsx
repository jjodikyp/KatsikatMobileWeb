import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import LoadingDots from '../components/LoadingDots';
import AntrianHeader from '../components/AntrianHeader';
import LordIcon from "../components/LordIcon";

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
  const [imageLoading, setImageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);

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

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter data berdasarkan pencarian
  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setFilteredTreatments(antrianTreatment);
    } else {
      const searchLower = debouncedSearch.toLowerCase();
      const filtered = antrianTreatment.filter(item => 
        item.order?.customer?.name?.toLowerCase().includes(searchLower) ||
        item.treatment?.name?.toLowerCase().includes(searchLower)
      );
      setFilteredTreatments(filtered);
    }
  }, [debouncedSearch, antrianTreatment]);

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

  const getThumbnailUrl = (originalUrl) => {
    // Jika menggunakan Cloudinary
    if (originalUrl.includes('cloudinary')) {
      return originalUrl.replace('/upload/', '/upload/w_200,h_200,c_fill/');
    }
    // Jika menggunakan ImageKit
    if (originalUrl.includes('imagekit')) {
      return originalUrl + '?tr=w-200,h-200';
    }
    // Jika tidak menggunakan CDN, gunakan URL original
    return originalUrl;
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#E6EFF9] font-montserrat">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#E6EFF9]">
        <AntrianHeader />

        {/* Filter Section */}
        <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex flex-col gap-4 w-full md:max-w-none bg-[#E6EFF9] shadow-lg">
          {/* Title dan Filter Buttons */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bebas">
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
                  className={`ml-4 px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedFilter === "cleaning"
                      ? "bg-[#57AEFF] text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-2 outline-white"
                      : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-5 h-5"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" 
                    />
                  </svg>
                  Cleaning
                  {cleaningCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-[#FD8087] text-white rounded-full w-6 h-6 flex items-center justify-center font-montserrat text-xs">
                      {cleaningCount}
                    </div>
                  )}
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => handleFilterChange("repair")}
                  className={`ml-2 px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedFilter === "repair"
                      ? "bg-[#57AEFF] text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-2 outline-white"
                      : "bg-[#E6EFF9] text-gray-600 shadow shadow-current opacity-100 outline outline-2 outline-white"
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-5 h-5"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" 
                    />
                  </svg>
                  Repair
                  {repairCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-[#FD8087] text-white rounded-full w-6 h-6 flex items-center justify-center font-montserrat text-xs">
                      {repairCount}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by customer name or treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white text-gray-700 placeholder-gray-400 placeholder:text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
              <LordIcon
                src="https://cdn.lordicon.com/wjyqkiew.json"
                trigger="loop"
                state="loop-oscillate"
                style={{ width: "25px", height: "25px" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Dengan padding top yang disesuaikan */}
      <main className="mx-auto px-4 md:px-10 pt-[220px] pb-24 h-[100dvh] overflow-y-auto">
        <div className="max-w-[390px] md:max-w-none mx-auto">
          {/* Treatment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTreatments.length > 0 ? (
              filteredTreatments.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white"
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
                        <>
                          {imageLoading && <LoadingDots />}
                          <img
                            src={getThumbnailUrl(item.shoes_photos[0].url_photo)}
                            alt="Shoes"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onLoad={() => setImageLoading(false)}
                          />
                        </>
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
                  <button className="w-full h-[35px] mb-auto mt-4 rounded-xl flex items-center justify-center text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] font-semibold bg-[#57AEFF] text-white opacity-100 outline outline-1 outline-white">
                    Mulai Treatment
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchQuery.trim() !== "" 
                  ? "No treatments found matching your search"
                  : `Tidak ada antrian treatment untuk kategori ${selectedFilter}`
                }
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
              className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-3xl w-full outline outline-2 outline-white
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
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-montserrat shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white"
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
