import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import absenImage from "../assets/images/absen.png";

const Absensi = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [showIzinModal, setShowIzinModal] = useState(false);
  const [showModalContent, setShowModalContent] = useState(false);
  const [alasanIzin, setAlasanIzin] = useState("");
  const [error, setError] = useState("");

  // Handle modal animation
  useEffect(() => {
    if (showIzinModal) {
      setTimeout(() => {
        setShowModalContent(true);
      }, 100);
    } else {
      setShowModalContent(false);
    }
  }, [showIzinModal]);

  // Koordinat outlet
  const OUTLET_LOCATION = {
    lat: -6.9401128, // Latitude outlet Katsikat
    lng: 106.9447146, // Longitude outlet Katsikat
  };
  // const OUTLET_LOCATION = {
  //   lat: -7.9672996,  // Latitude outlet Katsikat
  //   lng: 112.6446889  // Longitude outlet Katsikat
  // };

  const ALLOWED_RADIUS = 10; // Radius dalam meter

  // Fungsi untuk menghitung jarak antara dua koordinat (dalam meter)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius bumi dalam meter
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Jarak dalam meter
  };

  // Fungsi untuk mengecek lokasi user
  const checkLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          console.log("Lokasi user:", { lat: userLat, lng: userLng });

          setUserLocation({ lat: userLat, lng: userLng });

          // Hitung jarak ke outlet
          const distance = calculateDistance(
            userLat,
            userLng,
            OUTLET_LOCATION.lat,
            OUTLET_LOCATION.lng
          );

          console.log("Jarak ke outlet:", distance, "meter");

          if (distance <= ALLOWED_RADIUS) {
            // User dalam radius yang diizinkan
            navigate("/loginSuccess");
          } else {
            setError(
              "Anda harus berada dalam radius 10 meter dari outlet untuk melakukan absensi!"
            );
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan."
          );
        }
      );
    } else {
      setError("Browser Anda tidak mendukung geolocation.");
    }
  };

  // Handle absensi hadir
  const handleHadir = () => {
    setError("");
    checkLocation();
  };

  // Handle submit izin
  const handleSubmitIzin = () => {
    if (!alasanIzin.trim()) {
      setError("Mohon isi alasan izin/libur");
      return;
    }

    // Proses pengiriman izin ke backend bisa ditambahkan di sini
    console.log("Alasan izin:", alasanIzin);
    navigate("/loginSuccess");
  };

  // Handle modal close dengan animasi
  const handleCloseModal = () => {
    setShowModalContent(false);
    setTimeout(() => {
      setShowIzinModal(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Container dengan padding yang responsive */}
      <div className="max-w-[390px] mx-auto px-4 sm:px-6 md:px-10 py-8 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-[282px] flex flex-col items-center">
          {/* Title */}
          <h1 className="font-bebas text-2xl text-gray-800 tracking-wide text-center mb-3">
            SILAHKAN MELAKUKAN ABSENSI
          </h1>
          <p className="font-montserrat text-xs text-gray-800 tracking-wide text-center mb-3">
            Pastikan Anda berada di dalam radius 10 meter dari outlet saat
            melakukan absensi!
          </p>

          {/* Tambahkan gambar absen di sini */}
          <img
            src={absenImage}
            alt="Absensi"
            className="w-[130px] h-auto mb-6 mt-6" // Sesuaikan ukuran sesuai kebutuhan
          />

          {/* Error Message */}
          {error && (
            <div className="w-full bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-montserrat text-center">
              {error}
            </div>
          )}

          {/* Buttons */}
          <button
            onClick={() => setShowIzinModal(true)}
            className="w-full max-w-[282px] py-3.5 px-4 bg-[#FFCA42] text-black font-montserrat rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 text-xs mb-4"
          >
            IZIN / CLAIM LIBUR
          </button>

          <button
            onClick={handleHadir}
            className="w-full max-w-[282px] py-3.5 px-4 font-montserrat rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 text-xs bg-[#51A7D9] hover:bg-[#2F82B2] active:bg-[#2F82B2] text-white"
          >
            HADIR
          </button>

          {/* Modal Izin dengan animasi */}
          {showIzinModal && (
            <div 
              className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center p-4 z-50
                ${showModalContent ? 'bg-opacity-50' : 'bg-opacity-0'}`}
            >
              <div 
                className={`bg-white rounded-xl p-6 w-full max-w-[320px] mx-4 sm:mx-auto transform transition-all duration-300
                  ${showModalContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-full scale-150'}`}
              >
                <h2 className="font-bebas text-2xl mb-4 text-center">
                  ALASAN IZIN / LIBUR
                </h2>
                <textarea
                  value={alasanIzin}
                  onChange={(e) => setAlasanIzin(e.target.value)}
                  placeholder="Tuliskan alasan izin/libur Anda di sini..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-lg mb-4 font-montserrat text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-montserrat rounded-xl text-xs hover:bg-gray-200 transition-colors"
                  >
                    BATAL
                  </button>
                  <button
                    onClick={handleSubmitIzin}
                    className="flex-1 py-3 px-4 bg-[#51A7D9] text-white font-montserrat rounded-xl text-xs hover:bg-opacity-90 transition-colors"
                  >
                    KIRIM
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Absensi;
