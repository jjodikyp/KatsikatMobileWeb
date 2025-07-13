import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import AntrianHeader from '../../components/Header Antrian/AntrianHeader';
import AntrianKurirContent from '../../components/AntrianKurirContent';
import AnimatedButton from '../../components/Design/AnimatedButton';
import WhatsAppFormatter from '../../components/WhatsAppMessage/WhatsAppFormatter';
import { getKurirAntrianData, updateOrderStatus } from '../../services/kurirService';

const AntrianKurir = () => {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { dateRange } = location.state || {};

  const [antrianData, setAntrianData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredAntrian, setFilteredAntrian] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAntrianData = async () => {
      setLoading(true);
      try {
        // Ambil data dari API dengan rentang waktu dari location state atau default
        const currentDateRange = dateRange || {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        };
        
        const data = await getKurirAntrianData(currentDateRange);
        
        // Filter data sesuai pickup_method (pickup/delivery)
        const filtered = data.filter(item => item.pickup_method === type);
        setAntrianData(filtered);
        setFilteredAntrian(filtered);
        
        console.log(`Antrian ${type}:`, {
          totalData: data.length,
          filteredData: filtered.length,
          pickupCount: data.filter(item => item.pickup_method === 'pickup').length,
          deliveryCount: data.filter(item => item.pickup_method === 'delivery').length
        });
      } catch (error) {
        console.error('Error fetching antrian data:', error);
        if (error.response?.status === 401) {
          console.error('Token tidak valid atau expired');
          navigate('/login');
        }
        setAntrianData([]);
        setFilteredAntrian([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAntrianData();
  }, [type, dateRange]);

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
        item.address.toLowerCase().includes(searchLower)
      );
      setFilteredAntrian(filtered);
    }
  }, [debouncedSearch, antrianData]);

  const handleWhatsApp = (phone, message) => {
    const url = `https://wa.me/6282255355740?text=${message}`;
    window.open(url, '_blank');
  };

  const handleStartDelivery = async (id) => {
    try {
      // Update status di API
      await updateOrderStatus(id, 'ongoing');
      
      // Update state lokal
      setAntrianData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, status: 'ongoing' } : item
        )
      );
      
      const item = antrianData.find(item => item.id === id);
      if (item) {
        const message = WhatsAppFormatter.formatStartDeliveryMessage(type);
        handleWhatsApp(item.phone, message);
      }
    } catch (error) {
      console.error('Error starting delivery:', error);
      if (error.response?.status === 401) {
        console.error('Token tidak valid atau expired');
        navigate('/login');
      }
    }
  };

  const handleCancelDelivery = async (id) => {
    try {
      // Update status di API
      await updateOrderStatus(id, 'pending');
      
      // Update state lokal
      setAntrianData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, status: 'pending' } : item
        )
      );
    } catch (error) {
      console.error('Error canceling delivery:', error);
      if (error.response?.status === 401) {
        console.error('Token tidak valid atau expired');
        navigate('/login');
      }
    }
  };

  const handleCompleteDelivery = async (id) => {
    try {
      // Update status di API
      await updateOrderStatus(id, 'completed');
      
      const item = antrianData.find(item => item.id === id);
      if (item) {
        const message = WhatsAppFormatter.formatCompletionMessage();
        handleWhatsApp(item.phone, message);
      }
      
      // Hapus dari state lokal
      setAntrianData(prevData => 
        prevData.filter(item => item.id !== id)
      );
    } catch (error) {
      console.error('Error completing delivery:', error);
      if (error.response?.status === 401) {
        console.error('Token tidak valid atau expired');
        navigate('/login');
      }
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-white font-montserrat">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white">
        <AntrianHeader />
        <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex flex-col gap-4 w-full md:max-w-none bg-white shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bebas">
              {type === "pickup" ? "Pick Up" : "Delivery"}
            </h1>
            <div className="flex-1 max-w-md ml-4">
              <input
                type="text"
                placeholder="Cari nama atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white outline outline-1 outline-[#C1C1C1] text-gray-700 placeholder-gray-400 placeholder:text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 md:px-10 pt-[140px] pb-24 h-[100dvh] overflow-y-auto">
        <AntrianKurirContent 
          filteredAntrian={filteredAntrian}
          type={type}
          searchQuery={searchQuery}
          handleWhatsApp={handleWhatsApp}
          handleStartDelivery={handleStartDelivery}
          handleCancelDelivery={handleCancelDelivery}
          handleCompleteDelivery={handleCompleteDelivery}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default AntrianKurir; 