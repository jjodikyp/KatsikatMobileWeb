import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";
import AntrianHeader from "../../components/Header Antrian/AntrianHeader";
import LoadingDots from "../../components/Design/LoadingDots";
import AnimatedButton from "../../components/Design/AnimatedButton";
import FilterAndSearch from "../../components/Header Antrian/FilterAndSearch";
import QualityCheckModal from "../../components/Modal/QualityCheckModal";
import dummyKasirAntrianData from "../../services/dummyKasirAntrianData";

const AntrianKasir = () => {
  const { estimasi } = useParams();
  const location = useLocation();
  const { dateRange } = location.state || {};
  const navigate = useNavigate();

  const [antrianData, setAntrianData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("cleaning");
  const [cleaningCount, setCleaningCount] = useState(0);
  const [repairCount, setRepairCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredAntrian, setFilteredAntrian] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showQCModal, setShowQCModal] = useState(false);
  const [selectedQCType, setSelectedQCType] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [notifModal, setNotifModal] = useState({ open: false, message: "" });

  useEffect(() => {
    // Filter data dummy sesuai filter dan estimasi
    const filteredData = dummyKasirAntrianData.filter(
      (item) =>
        item.treatment_type?.toLowerCase() === selectedFilter.toLowerCase() &&
        item.process_time?.toLowerCase() === estimasi?.toLowerCase()
    );
    setAntrianData(filteredData);
    setFilteredAntrian(filteredData);

    // Hitung total untuk masing-masing kategori
    setCleaningCount(
      dummyKasirAntrianData.filter(
        (item) =>
          item.treatment_type?.toLowerCase() === "cleaning" &&
          item.process_time?.toLowerCase() === estimasi?.toLowerCase()
      ).length
    );
    setRepairCount(
      dummyKasirAntrianData.filter(
        (item) =>
          item.treatment_type?.toLowerCase() === "repair" &&
          item.process_time?.toLowerCase() === estimasi?.toLowerCase()
      ).length
    );
  }, [selectedFilter, estimasi]);

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
      setFilteredAntrian(antrianData);
    } else {
      const searchLower = debouncedSearch.toLowerCase();
      const filtered = antrianData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.treatment_type.toLowerCase().includes(searchLower)
      );
      setFilteredAntrian(filtered);
    }
  }, [debouncedSearch, antrianData]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const getThumbnailUrl = (originalUrl) => {
    return originalUrl;
  };

  const handleStatusUpdate = async (id, status) => {
    setSelectedItemId(id);
    setSelectedQCType(status);
    setShowQCModal(true);
  };

  const removeDummyItem = (id) => {
    const idx = dummyKasirAntrianData.findIndex((item) => item.id === id);
    if (idx !== -1) dummyKasirAntrianData.splice(idx, 1);
  };

  const updateDummyStatus = (id, status) => {
    const idx = dummyKasirAntrianData.findIndex((item) => item.id === id);
    if (idx !== -1) dummyKasirAntrianData[idx].status = status;
  };

  const handleQCSubmit = async (result) => {
    try {
      // Step 1: POST ke /qualityControl
      const qcPayload = {
        treatment_id: selectedItemId,
        qc_status: result.status,
        ...(result.status === "failed" && {
          rejection_reason: result.reason,
        }),
        ...(result.status === "passed" && {
          delivery_method: result.deliveryOption,
          ...(result.deliveryOption === "pickup" && {
            outlet_name: "Outlet A", // Bisa disesuaikan dengan data outlet yang tersedia
          }),
          ...(result.deliveryOption === "delivery" && {
            delivery_date: result.deliveryDateTime.split(" ")[0],
            delivery_time: result.deliveryDateTime.split(" ")[1],
          }),
        }),
      };

      // POST quality control data
      await axios.post(
        "https://680340c50a99cb7408eb7488.mockapi.io/api/test/qualityControl",
        qcPayload
      );

      // Step 2: PATCH status treatment
      const updateData = {
        status: result.status,
      };

      await axios.put(
        `https://680340c50a99cb7408eb7488.mockapi.io/api/test/treatments/${selectedItemId}`,
        updateData
      );

      if (result.status === "failed") {
        // Hapus dari dummy
        removeDummyItem(selectedItemId);
        setAntrianData((prev) =>
          prev.filter((item) => item.id !== selectedItemId)
        );
        setFilteredAntrian((prev) =>
          prev.filter((item) => item.id !== selectedItemId)
        );
        setNotifModal({
          open: true,
          message:
            "Item sudah dikirim kembali ke antrian teknisi untuk dilakukan treatment ulang.",
        });
      } else {
        // Update status di dummy
        updateDummyStatus(selectedItemId, "passed");
        setAntrianData((prev) =>
          prev.map((item) =>
            item.id === selectedItemId ? { ...item, status: "passed" } : item
          )
        );
        setFilteredAntrian((prev) =>
          prev.map((item) =>
            item.id === selectedItemId ? { ...item, status: "passed" } : item
          )
        );
      }

      setShowQCModal(false);
      setSelectedQCType(null);
      setSelectedItemId(null);
    } catch (error) {
      console.error("Error processing QC:", error);
      // Bisa tambahkan notifikasi error ke user
    }
  };

  const handleOpenQueue = () => {
    // Konversi format estimasi jika diperlukan
    const estimasiFormat =
      {
        regular: "regular",
        same_day: "same_day",
        next_day: "next_day",
      }[selectedEstimasi] || selectedEstimasi;

    navigate(`/berandakasir/antriankasir/${estimasiFormat}`, {
      state: {
        dateRange,
        estimasi: estimasiFormat,
      },
    });
  };

  return (
    <div className="h-screen overflow-y-auto font-montserrat">
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

      {/* Main Content */}
      <main className="mx-auto px-4 md:px-10 pt-[220px] pb-24 h-[100dvh] overflow-y-auto">
        <div className="max-w-[390px] md:max-w-none mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAntrian.length > 0 ? (
              filteredAntrian.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 outline outline-1 outline-[#C1C1C1] relative"
                >
                  {/* Badge status untuk QC */}
                  {item.status === "passed" && (
                    <div className="absolute top-4 right-4 bg-[#2E7CF6] text-white text-xs font-bold px-3 py-1 rounded-full">
                      Lolos QC
                    </div>
                  )}
                  {item.status === "failed" && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Tidak Lolos QC
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-[100px] h-[100px] min-w-[100px] bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer"
                      onClick={() => {
                        setSelectedImage(item.image_url);
                        setShowModal(true);
                      }}
                    >
                      {imageLoading && <LoadingDots />}
                      <img
                        src={item.image_url}
                        alt="Shoes"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onLoad={() => setImageLoading(false)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-md md:text-base truncate">
                        {item.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {item.treatment_type}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 text-[#AA3328]">
                        {item.note}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-2 font-bold">
                        {format(new Date(item.due_date), "EEEE, dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <AnimatedButton
                      onClick={() => handleStatusUpdate(item.id, "failed")}
                      className={`flex-1 h-[35px] rounded-xl flex items-center justify-center text-sm font-semibold
                        ${
                          item.status === "failed"
                            ? "bg-red-500 text-white"
                            : item.status === "passed"
                            ? "bg-red-200 text-red-400 cursor-not-allowed"
                            : "bg-white text-red-500 outline outline-1 outline-red-500 hover:bg-red-50"
                        }
                      `}
                      disabled={item.status === "passed"}
                    >
                      Tidak Lolos
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={() => handleStatusUpdate(item.id, "passed")}
                      className={`flex-1 h-[35px] rounded-xl flex items-center justify-center text-sm font-semibold
                        ${
                          item.status === "passed"
                            ? "bg-[#2E7CF6] text-white"
                            : item.status === "failed"
                            ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                            : "bg-[#E6EFF9] text-[#2E7CF6] hover:bg-blue-50"
                        }
                      `}
                      disabled={item.status === "failed"}
                    >
                      Lolos
                    </AnimatedButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchQuery.trim() !== ""
                  ? "No items found matching your search"
                  : `Tidak ada antrian untuk kategori ${selectedFilter}`}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Image Preview Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
              onClick={() => {
                setShowModal(false);
                setSelectedImage(null);
              }}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">
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
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality Check Modal */}
      <QualityCheckModal
        isOpen={showQCModal}
        onClose={() => {
          setShowQCModal(false);
          setSelectedQCType(null);
          setSelectedItemId(null);
        }}
        type={selectedQCType}
        onSubmit={handleQCSubmit}
      />

      {/* Notifikasi Modal */}
      {notifModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xs text-center">
            <div className="text-[#2E7CF6] font-bold text-lg mb-2">
              Notifikasi
            </div>
            <div className="text-gray-700 mb-4">{notifModal.message}</div>
            <button
              className="px-6 py-2 bg-[#2E7CF6] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => setNotifModal({ open: false, message: "" })}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AntrianKasir;
