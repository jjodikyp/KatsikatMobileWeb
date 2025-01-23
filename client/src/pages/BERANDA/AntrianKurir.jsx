import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import AntrianHeader from '../../components/Header Antrian/AntrianHeader';
import AntrianKurirContent from '../../components/AntrianKurirContent';
import AnimatedButton from '../../components/Design/AnimatedButton';
import WhatsAppFormatter from '../../components/WhatsAppMessage/WhatsAppFormatter';

const AntrianKurir = () => {
  const { type } = useParams();
  const location = useLocation();
  const { dateRange } = location.state || {};

  const [antrianData, setAntrianData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredAntrian, setFilteredAntrian] = useState([]);

  useEffect(() => {
    fetchDummyData();
  }, []);

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

  const fetchDummyData = () => {
    // Data dummy dengan status
    const dummyData = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      customerName: `Customer ${index + 1}`,
      address: `Jl. Contoh No. ${index + 1}, Kota Jakarta`,
      phone: `08123456789${index}`,
      requestTime: new Date(Date.now() + (index * 60 * 60 * 1000)),
      googleMapsUrl: 'https://maps.google.com',
      status: 'pending'
    }));

    setAntrianData(dummyData);
    setFilteredAntrian(dummyData);
  };

  const handleWhatsApp = (phone, message) => {
    const url = `https://wa.me/6282255355740?text=${message}`;
    window.open(url, '_blank');
  };

  const handleStartDelivery = (id) => {
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
  };

  const handleCancelDelivery = (id) => {
    setAntrianData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, status: 'pending' } : item
      )
    );
  };

  const handleCompleteDelivery = (id) => {
    const item = antrianData.find(item => item.id === id);
    if (item) {
      const message = WhatsAppFormatter.formatCompletionMessage();
      handleWhatsApp(item.phone, message);
    }
    
    setAntrianData(prevData => 
      prevData.filter(item => item.id !== id)
    );
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#E6EFF9] font-montserrat">
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#E6EFF9]">
        <AntrianHeader />
        <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex flex-col gap-4 w-full md:max-w-none bg-[#E6EFF9] shadow-lg">
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
                className="w-full px-4 py-2 rounded-xl bg-[#E6EFF9] text-gray-600 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white placeholder:text-gray-400 placeholder:text-sm"
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
        />
      </main>
    </div>
  );
};

export default AntrianKurir; 