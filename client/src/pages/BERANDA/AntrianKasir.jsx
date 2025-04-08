import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import AntrianHeader from '../../components/Header Antrian/AntrianHeader';
import LoadingDots from '../../components/Design/LoadingDots';
import AnimatedButton from "../../components/Design/AnimatedButton";
import FilterAndSearch from '../../components/Header Antrian/FilterAndSearch';
import QualityCheckModal from '../../components/Modal/QualityCheckModal';

const AntrianKasir = () => {
  const { estimasi } = useParams();
  const location = useLocation();
  const { dateRange } = location.state || {};

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

  useEffect(() => {
    fetchDummyData();
  }, [selectedFilter]);

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
      const filtered = antrianData.filter(item => 
        item.customerName.toLowerCase().includes(searchLower) ||
        item.treatment.toLowerCase().includes(searchLower)
      );
      setFilteredAntrian(filtered);
    }
  }, [debouncedSearch, antrianData]);

  const fetchDummyData = () => {
    // Data dummy
    const dummyData = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      customerName: `Customer ${index + 1}`,
      treatment: selectedFilter === "cleaning" ? "Deep Cleaning" : "Repair Sol",
      notes: "Treatment harus ekstra hati-hati",
      dueDate: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)),
      photoUrl: "https://picsum.photos/200",
      status: "pending"
    }));

    setAntrianData(dummyData);
    setFilteredAntrian(dummyData);
    setCleaningCount(6);
    setRepairCount(4);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const getThumbnailUrl = (originalUrl) => {
    return originalUrl;
  };

  const handleStatusUpdate = (id, status) => {
    setSelectedItemId(id);
    setSelectedQCType(status);
    setShowQCModal(true);
  };

  const handleQCSubmit = (result) => {
    console.log('QC Result for item', selectedItemId, ':', result);
    // Implementasi logika update status
    setShowQCModal(false);
    setSelectedQCType(null);
    setSelectedItemId(null);
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
                  className="bg-white rounded-3xl p-4 outline outline-1 outline-[#C1C1C1]"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-[100px] h-[100px] min-w-[100px] bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer"
                      onClick={() => {
                        setSelectedImage(item.photoUrl);
                        setShowModal(true);
                      }}
                    >
                      {imageLoading && <LoadingDots />}
                      <img
                        src={getThumbnailUrl(item.photoUrl)}
                        alt="Shoes"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onLoad={() => setImageLoading(false)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-md md:text-base truncate">
                        {item.customerName}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {item.treatment}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 text-[#AA3328]">
                        {item.notes}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-2 font-bold">
                        {format(item.dueDate, "EEEE, dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <AnimatedButton 
                      onClick={() => handleStatusUpdate(item.id, 'failed')}
                      className="flex-1 h-[35px] rounded-xl flex items-center justify-center text-sm text-red-500 opacity-100 outline outline-1 outline-red-500 font-semibold"
                    >
                      Tidak Lolos
                    </AnimatedButton>
                    <AnimatedButton 
                      onClick={() => handleStatusUpdate(item.id, 'passed')}
                      variant="blue"
                      className="flex-1 h-[35px] rounded-xl flex items-center justify-center text-sm"
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
                  : `Tidak ada antrian untuk kategori ${selectedFilter}`
                }
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
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
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
    </div>
  );
};

export default AntrianKasir; 