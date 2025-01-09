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
  const [selectedFilter, setSelectedFilter] = useState('cleaning');

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
    }
    
    fetchAntrianData();
  }, [selectedFilter, dateRange, estimasi]);

  const fetchAntrianData = async () => {
    try {
      const processTime = estimasi === 'sameDay' ? 'same_day' : 
                         estimasi === 'nextDay' ? 'next_day' : 
                         'regular';
                         
      console.log('Fetching data with params:', {
        processTime,
        serviceType: selectedFilter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order-details/process/${processTime}`,
        {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            serviceType: selectedFilter
          }
        }
      );
      
      console.log('Response data:', response.data);
      setAntrianTreatment(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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

      {/* Main Content */}
      <main className="mx-auto px-4 md:px-10 pt-24 pb-6">
        <div className="max-w-[390px] md:max-w-none mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bebas">
              Antrian  - {estimasi === 'sameDay' ? 'Same Day' : 
                                 estimasi === 'nextDay' ? 'Next Day' : 
                                 'Regular'}
            </h1>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('cleaning')}
                className={`ml-2 px-4 py-2 rounded-lg transition-all ${
                  selectedFilter === 'cleaning'
                    ? 'bg-[#51A7D9] text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Cleaning
              </button>
              <button
                onClick={() => handleFilterChange('repair')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedFilter === 'repair'
                    ? 'bg-[#51A7D9] text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Repair
              </button>
            </div>
          </div>
          
          {/* Treatment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {antrianTreatment.length > 0 ? (
              antrianTreatment.map((item) => (
                <div key={item.id} className="bg-[#F4FBFF] rounded-2xl p-4 outline outline-2 outline-[#E3E3E3]">
                  <div className="flex items-start gap-4">
                    <div className="w-[120px] h-[120px] min-w-[120px] bg-gray-200 rounded-lg overflow-hidden">
                      {item.shoes_photos && item.shoes_photos.length > 0 ? (
                        <img
                          src={item.shoes_photos[0].url_photo}
                          alt="Shoes"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">
                        {item.order?.customer?.name || "No Name"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {item.treatment?.name || "No Treatment"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 font-bold line-clamp-2">
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
                Tidak ada antrian treatment untuk kategori {selectedFilter}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Antrian; 