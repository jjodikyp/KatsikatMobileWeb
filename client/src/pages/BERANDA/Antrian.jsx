import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import LoadingDots from '../../components/Design/LoadingDots';
import AntrianHeader from '../../components/Header Antrian/AntrianHeader';
import LordIcon from "../../components/Design/LordIcon";
import FilterAndSearch from '../../components/Header Antrian/FilterAndSearch';
import AnimatedButton from '../../components/Design/AnimatedButton';

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
        <FilterAndSearch 
          estimasi={estimasi}
          selectedFilter={selectedFilter}
          handleFilterChange={handleFilterChange}
          cleaningCount={cleaningCount}
          repairCount={repairCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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
                  <AnimatedButton
                    className="w-full h-[35px] mb-auto mt-4 rounded-xl flex items-center justify-center text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] font-semibold bg-[#57AEFF] text-white opacity-100 outline outline-1 outline-white"
                  >
                    Mulai Treatment
                  </AnimatedButton>
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
