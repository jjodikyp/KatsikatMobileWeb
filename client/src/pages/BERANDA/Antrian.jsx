import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import AntrianHeader from "../../components/Header Antrian/AntrianHeader";
import FilterAndSearch from "../../components/Header Antrian/FilterAndSearch";
import AnimatedButton from "../../components/Design/AnimatedButton";
import TreatmentDetailModal from "../../components/Modal/TreatmentDetailModal";
import dummyTimerApi from "../../services/dummyTimerApi";
import dummyAntrianData from "../../services/dummyAntrianData";

const Antrian = () => {
  const navigate = useNavigate();
  const { estimasi } = useParams();
  const location = useLocation();
  const { dateRange } = location.state || {};
  const { antrianData: antrianFromState } = location.state || {};

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
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [activeTreatments, setActiveTreatments] = useState({});
  const [intervals, setIntervals] = useState({});
  const [countRegular, setCountRegular] = useState(0);
  const [countSameDay, setCountSameDay] = useState(0);
  const [countNextDay, setCountNextDay] = useState(0);
  const [countRegularCleaning, setCountRegularCleaning] = useState(0);
  const [countRegularRepair, setCountRegularRepair] = useState(0);
  const [countSameDayCleaning, setCountSameDayCleaning] = useState(0);
  const [countSameDayRepair, setCountSameDayRepair] = useState(0);
  const [countNextDayCleaning, setCountNextDayCleaning] = useState(0);
  const [countNextDayRepair, setCountNextDayRepair] = useState(0);

  useEffect(() => {
  

    // Ambil estimasi dari params (regular, sameDay, nextDay)
    let filteredData = dummyAntrianData;
    if (estimasi === "regular") {
      filteredData = dummyAntrianData.filter(
        (item) => item.process_time === "Regular"
      );
      if (selectedFilter === "cleaning") {
        filteredData = filteredData.filter(
          (item) => item.treatment?.name?.toLowerCase() === "cleaning"
        );
      } else if (selectedFilter === "repair") {
        filteredData = filteredData.filter(
          (item) => item.treatment?.name?.toLowerCase() === "repair"
        );
      }
    } else if (estimasi === "sameDay") {
      filteredData = dummyAntrianData.filter(
        (item) => item.process_time === "Same Day"
      );
      if (selectedFilter === "cleaning") {
        filteredData = filteredData.filter(
          (item) => item.treatment?.name?.toLowerCase() === "cleaning"
        );
      } else if (selectedFilter === "repair") {
        filteredData = filteredData.filter(
          (item) => item.treatment?.name?.toLowerCase() === "repair"
        );
      }
    } else if (estimasi === "nextDay") {
      filteredData = dummyAntrianData.filter(
        (item) => item.process_time === "Next Day"
      );
      if (selectedFilter === "cleaning") {
        filteredData = filteredData.filter(
          (item) => item.treatment?.name?.toLowerCase() === "cleaning"
        );
      } else if (selectedFilter === "repair") {
        filteredData = filteredData.filter(
          (item) => item.treatment?.name?.toLowerCase() === "repair"
        );
      }
    }
    setAntrianTreatment(filteredData);
    setFilteredTreatments(filteredData);
    setCleaningCount(
      filteredData.filter(
        (item) => item.treatment?.name?.toLowerCase() === "cleaning"
      ).length
    );
    setRepairCount(
      filteredData.filter(
        (item) => item.treatment?.name?.toLowerCase() === "repair"
      ).length
    );
    console.log('Estimasi:', estimasi, 'SelectedFilter:', selectedFilter, 'FilteredData:', filteredData);
  }, [selectedFilter, estimasi]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
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
      const filtered = antrianTreatment.filter(
        (item) =>
          item.order?.customer?.name?.toLowerCase().includes(searchLower) ||
          item.treatment?.name?.toLowerCase().includes(searchLower)
      );
      setFilteredTreatments(filtered);
    }
  }, [debouncedSearch, antrianTreatment]);

  // Effect untuk memuat timer saat mount dan setelah data treatment diambil
  useEffect(() => {
    if (filteredTreatments.length > 0) {
      fetchActiveTimers();
    }
  }, [filteredTreatments]);

  useEffect(() => {
    // Total per estimasi
    setCountRegular(
      dummyAntrianData.filter((item) => item.process_time === "Regular").length
    );
    setCountSameDay(
      dummyAntrianData.filter((item) => item.process_time === "Same Day").length
    );
    setCountNextDay(
      dummyAntrianData.filter((item) => item.process_time === "Next Day").length
    );
    // Total per treatment per estimasi
    setCountRegularCleaning(
      dummyAntrianData.filter(
        (item) =>
          item.process_time === "Regular" &&
          item.treatment?.name?.toLowerCase() === "cleaning"
      ).length
    );
    setCountRegularRepair(
      dummyAntrianData.filter(
        (item) =>
          item.process_time === "Regular" &&
          item.treatment?.name?.toLowerCase() === "repair"
      ).length
    );
    setCountSameDayCleaning(
      dummyAntrianData.filter(
        (item) =>
          item.process_time === "Same Day" &&
          item.treatment?.name?.toLowerCase() === "cleaning"
      ).length
    );
    setCountSameDayRepair(
      dummyAntrianData.filter(
        (item) =>
          item.process_time === "Same Day" &&
          item.treatment?.name?.toLowerCase() === "repair"
      ).length
    );
    setCountNextDayCleaning(
      dummyAntrianData.filter(
        (item) =>
          item.process_time === "Next Day" &&
          item.treatment?.name?.toLowerCase() === "cleaning"
      ).length
    );
    setCountNextDayRepair(
      dummyAntrianData.filter(
        (item) =>
          item.process_time === "Next Day" &&
          item.treatment?.name?.toLowerCase() === "repair"
      ).length
    );
  }, []);

  const fetchAntrianData = async () => {
    try {
      const params = {
        search: searchQuery || "",
        startDate: formatDateForDB(dateRange.startDate),
        endDate: formatDateForDB(dateRange.endDate),
      };

      const response = await axios.get("https://api.katsikat.id/orders", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.data) {
        // Filter data berdasarkan status dan jenis treatment
        const filteredData = response.data.data.filter(
          (item) => item.status === "not_yet"
        );

        // Pisahkan data berdasarkan jenis treatment
        const cleaningData = filteredData.filter((item) =>
          item.treatment?.name?.toLowerCase().includes("cleaning")
        );

        const repairData = filteredData.filter((item) =>
          item.treatment?.name?.toLowerCase().includes("repair")
        );

        setCleaningCount(cleaningData.length);
        setRepairCount(repairData.length);

        // Set data berdasarkan filter yang dipilih
        if (selectedFilter === "cleaning") {
          setAntrianTreatment(cleaningData);
        } else if (selectedFilter === "repair") {
          setAntrianTreatment(repairData);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        console.error("Token tidak valid atau expired");
        navigate("/login");
      }
    }
  };

  const fetchAntrianCounts = async () => {
    setCleaningCount(0);
    setRepairCount(0);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (antrianTreatment.length > 0) {
      const filteredData = antrianTreatment.filter(
        (item) =>
          item.status === "not_yet" &&
          (filter === "cleaning"
            ? item.treatment?.name?.toLowerCase().includes("cleaning")
            : item.treatment?.name?.toLowerCase().includes("repair"))
      );
      setFilteredTreatments(filteredData);
    }
  };

  const handleLogout = async () => {
    try {
      await dummyTimerApi.clearAllTimers();

      // Clear all intervals
      Object.values(intervals).forEach((interval) => clearInterval(interval));
      setIntervals({});
      setActiveTreatments({});

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getThumbnailUrl = (originalUrl) => {
    // Jika menggunakan Cloudinary
    if (originalUrl.includes("cloudinary")) {
      return originalUrl.replace("/upload/", "/upload/w_200,h_200,c_fill/");
    }
    // Jika menggunakan ImageKit
    if (originalUrl.includes("imagekit")) {
      return originalUrl + "?tr=w-200,h-200";
    }
    // Jika tidak menggunakan CDN, gunakan URL original
    return originalUrl;
  };

  // Fungsi untuk memformat durasi
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Fungsi untuk memulai treatment
  const handleStartTreatment = async (treatmentId) => {
    try {
      const { startTime } = await dummyTimerApi.startTreatment(treatmentId);

      setActiveTreatments((prev) => ({
        ...prev,
        [treatmentId]: {
          isStarted: true,
          startTime,
          duration: 0,
        },
      }));

      startTimer(treatmentId, startTime);
    } catch (error) {
      console.error("Error starting treatment:", error);
    }
  };

  // Fungsi untuk menjalankan timer
  const startTimer = (treatmentId, startTime) => {
    // Hitung durasi awal
    const now = new Date();
    const start = new Date(startTime);
    const initialDuration = Math.floor((now - start) / 1000);

    setActiveTreatments((prev) => ({
      ...prev,
      [treatmentId]: {
        isStarted: true,
        startTime,
        duration: initialDuration,
      },
    }));

    const newInterval = setInterval(() => {
      setActiveTreatments((prev) => {
        const treatment = prev[treatmentId];
        if (!treatment) return prev;

        const now = new Date();
        const start = new Date(treatment.startTime);
        const duration = Math.floor((now - start) / 1000);

        return {
          ...prev,
          [treatmentId]: {
            ...treatment,
            duration,
          },
        };
      });
    }, 1000);

    setIntervals((prev) => ({
      ...prev,
      [treatmentId]: newInterval,
    }));
  };

  // Fungsi untuk memuat data timer
  const fetchActiveTimers = async () => {
    try {
      const activeTimers = await dummyTimerApi.getActiveTimers();

      // Reset existing intervals
      Object.values(intervals).forEach((interval) => clearInterval(interval));
      setIntervals({});

      // Start new timers for each active treatment
      activeTimers.forEach((timer) => {
        const { treatmentId, startTime } = timer;
        setActiveTreatments((prev) => ({
          ...prev,
          [treatmentId]: {
            isStarted: true,
            startTime,
            duration: 0,
          },
        }));
        startTimer(treatmentId, startTime);
      });
    } catch (error) {
      console.error("Error fetching active timers:", error);
    }
  };

  // Effect untuk memuat timer saat komponen mount dan setelah refresh
  useEffect(() => {
    fetchActiveTimers();

    // Cleanup intervals saat unmount
    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, []);

  // Fungsi untuk membatalkan treatment
  const handleCancelTreatment = async (treatmentId) => {
    try {
      await dummyTimerApi.stopTreatment(treatmentId);

      if (intervals[treatmentId]) {
        clearInterval(intervals[treatmentId]);
      }

      setActiveTreatments((prev) => {
        const newState = { ...prev };
        delete newState[treatmentId];
        return newState;
      });

      setIntervals((prev) => {
        const newState = { ...prev };
        delete newState[treatmentId];
        return newState;
      });
    } catch (error) {
      console.error("Error canceling treatment:", error);
    }
  };

  // Update treatment card button section
  const renderTreatmentButton = (item) => {
    const activeTreatment = activeTreatments[item.id];

    if (!activeTreatment?.isStarted) {
      return (
        <AnimatedButton
          onClick={() => {
            setSelectedTreatment(item);
            setShowTreatmentModal(true);
          }}
          className="w-full h-[35px] mb-auto mt-4 rounded-xl flex items-center justify-center text-sm font-semibold bg-gradient-to-r from-[#5096FC] to-[#7BD1FD] text-white opacity-100"
        >
          Mulai Treatment
        </AnimatedButton>
      );
    }

    return (
      <AnimatedButton
        onClick={() => {
          setSelectedTreatment(item);
          setShowTreatmentModal(true);
        }}
        className="w-full h-[35px] mb-auto mt-4 rounded-xl flex items-center justify-center text-sm font-semibold bg-[#E6EFF9] text-[#2E7CF6] opacity-100 p-4"
      >
        Cek Detail Treatment ({formatDuration(activeTreatment.duration)})
      </AnimatedButton>
    );
  };

  return (
    <div className="h-screen overflow-y-auto bg-white font-montserrat">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white">
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
                  className="bg-white rounded-3xl p-4 opacity-100 outline outline-1 outline-[#C1C1C1]"
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
                          src={getThumbnailUrl(
                            item.shoes_photos[0].url_photo
                          )}
                          alt="Shoes"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onLoad={() => setImageLoading(false)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-md md:text-base truncate">
                        {item.name || "No Name"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {item.item?.name || "No Item"} -{" "}
                        {item.treatment?.name || "No Treatment"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        Process: {item.process_time || "Regular"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-2 font-bold">
                        {format(new Date(item.due_date), "EEEE, dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                  {renderTreatmentButton(item)}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchQuery.trim() !== ""
                  ? "Tidak ada treatment yang sesuai dengan pencarian Anda"
                  : `Tidak ada antrian treatment untuk kategori ${selectedFilter}`}
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
                showModal ? "bg-opacity-75" : "bg-opacity-0"
              }`}
              aria-hidden="true"
              onClick={() => {
                setShowModal(false);
                setSelectedImage(null);
              }}
            />

            {/* Modal container untuk centering */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal content dengan animasi */}
            <div
              className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-3xl w-full outline outline-2 outline-white
                ${
                  showModal
                    ? "opacity-100 translate-y-0 sm:scale-100"
                    : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                }`}
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

      <TreatmentDetailModal
        isOpen={showTreatmentModal}
        onClose={() => setShowTreatmentModal(false)}
        treatment={selectedTreatment?.treatment?.name}
        description={selectedTreatment?.description}
        treatmentId={selectedTreatment?.id}
        isStarted={activeTreatments[selectedTreatment?.id]?.isStarted}
        duration={activeTreatments[selectedTreatment?.id]?.duration || 0}
        onStart={handleStartTreatment}
        onCancel={handleCancelTreatment}
      />
    </div>
  );
};

export default Antrian;
