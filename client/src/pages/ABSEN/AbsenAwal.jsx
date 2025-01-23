import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import absenImage from "../../assets/images/absen.png";
import absenSound from "../../assets/sound/absen.mp3"; // Import sound file
import { FaMedkit, FaCalendarDay, FaUserClock } from "react-icons/fa";
import AnimatedButton from "../../components/Design/AnimatedButton";

const Absensi = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [showIzinModal, setShowIzinModal] = useState(false);
  const [showModalContent, setShowModalContent] = useState(false);
  const [alasanIzin, setAlasanIzin] = useState("");
  const [error, setError] = useState("");
  const [kategoriIzin, setKategoriIzin] = useState("");

  // Tambahkan state untuk audio
  const [audio] = useState(new Audio(absenSound));

  const kategoriOptions = [
    { value: "sakit", label: "Sakit", icon: <FaMedkit /> },
    { value: "libur_bersama", label: "Libur Bersama", icon: <FaCalendarDay /> },
    {
      value: "keperluan_pribadi",
      label: "Keperluan Pribadi",
      icon: <FaUserClock />,
    },
  ];

  // Fungsi untuk memainkan suara dengan volume yang diatur
  const playAbsenSound = async () => {
    try {
      const audio = new Audio(absenSound);
      audio.volume = 0.7; // Set ke 70%

      // Tambahkan event listener untuk debugging
      audio.addEventListener("play", () => {
        console.log("Audio mulai diputar");
      });

      audio.addEventListener("error", (e) => {
        console.error("Error audio:", e);
      });

      // Coba mainkan audio dengan await
      try {
        await audio.play();
        console.log("Sound effect berhasil diputar");
      } catch (playError) {
        console.error("Gagal memutar sound:", playError);
      }
    } catch (error) {
      console.error("Error setup audio:", error);
    }
  };

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
  // const OUTLET_LOCATION = {
  //   lat: -6.9401128, // Latitude outlet Katsikat
  //   lng: 106.9447146, // Longitude outlet Katsikat
  // };
  const OUTLET_LOCATION = {
    lat: -7.9888889, // Latitude outlet Katsikat
    lng: 112.6838822, // Longitude outlet Katsikat
  };

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

  // Fungsi untuk mengecek apakah waktu saat ini dalam rentang yang diizinkan
  const isWithinAllowedTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // Konversi ke menit

    // Rentang waktu pagi (08:00 - 08:30)
    const morningStart = 8 * 60; // 08:00
    const morningEnd = 15 * 60 + 30; // 08:30

    // Rentang waktu sore (16:00 - 16:30)
    const eveningStart = 16 * 60; // 16:00
    const eveningEnd = 24 * 60; // 01:00

    return (
      (currentTime >= morningStart && currentTime <= morningEnd) ||
      (currentTime >= eveningStart && currentTime <= eveningEnd)
    );
  };

  // Handle absensi hadir
  const handleHadir = () => {
    setError("");
    
    // Set session storage untuk tracking alur login
    sessionStorage.setItem('fromPresent', 'true');
    
    // Simpan waktu mulai kerja
    localStorage.setItem("workStartTime", new Date().toISOString());

    // Langsung navigasi ke loginSuccess
    navigate("/loginSuccess");

    // Cek lokasi sebagai background process
    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition(
    //     async (position) => {
    //       const userLat = position.coords.latitude;
    //       const userLng = position.coords.longitude;

    //       console.log("Lokasi user:", { lat: userLat, lng: userLng });

    //       setUserLocation({ lat: userLat, lng: userLng });

    //       // Hitung jarak ke outlet
    //       const distance = calculateDistance(
    //         userLat,
    //         userLng,
    //         OUTLET_LOCATION.lat,
    //         OUTLET_LOCATION.lng
    //       );

    //       console.log("Jarak ke outlet:", distance, "meter");

    //       if (distance <= ALLOWED_RADIUS) {
    //         // User dalam radius yang diizinkan
    //         try {
    //           await playAbsenSound(); // Mainkan suara saat berhasil
    //           console.log("Mencoba memutar suara");
    //         } catch (audioError) {
    //           console.error("Gagal memutar suara:", audioError);
    //         }
    //       } else {
    //         setError(
    //           "Anda harus berada dalam radius 10 meter dari outlet untuk melakukan absensi!"
    //         );
    //         // Jika di luar radius, kembali ke halaman absensi
    //         navigate("/absensi");
    //       }
    //     },
    //     (error) => {
    //       console.error("Error getting location:", error);
    //       setError(
    //         "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan."
    //       );
    //       // Jika error, kembali ke halaman absensi
    //       navigate("/absensi");
    //     }
    //   );
    // } else {
    //   setError("Browser Anda tidak mendukung geolocation.");
    //   // Jika browser tidak support, kembali ke halaman absensi
    //   navigate("/absensi");
    // }
  };

  // Handle submit izin
  const handleSubmitIzin = () => {
    if (!kategoriIzin) {
      setError("Mohon pilih kategori izin");
      return;
    }

    // Jika kategori izin adalah keperluan pribadi, maka tidak perlu isi alasan dan tidak perlu validasi
    if (kategoriIzin === "keperluan_pribadi") {
      setError("");
      navigate("/izin-success");
      return;
    }

    if (!alasanIzin.trim()) {
      setError("Mohon isi alasan izin/libur");
      return;
    }

    if (kategoriIzin === "libur_bersama" && !alasanIzin.trim()) {
      setError("Mohon isi alasan libur bersama");
      navigate("/izin-success");
      return;
    }

    if (kategoriIzin === "sakit" && !alasanIzin.trim()) {
      setError("Mohon isi alasan sakit");
      navigate("/izin-success");
      return;
    }

    console.log("Kategori izin:", kategoriIzin);
    console.log("Alasan izin:", alasanIzin);
    navigate("/izin-success");
  };

  // Handle modal close dengan animasi
  const handleCloseModal = () => {
    setShowModalContent(false);
    setTimeout(() => {
      setShowIzinModal(false);
    }, 300);
  };

  // Cleanup audio saat komponen unmount
  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white px-10 sm:px-0">
      <div className="w-full sm:w-[380px] p-8 sm:p-8 my-auto bg-white rounded-3xl shadow-2xl shadow-grey opacity-100 outline outline-2 outline-white">
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <img src={absenImage} alt="Absen" className="w-32 h-32" />
        </div>

        {/* Title & Description */}
        <h1 className="font-bebas text-2xl text-gray-800 tracking-wide text-center mb-3">
          PLEASE TAKE YOUR ATTENDANCE
        </h1>
        <p className="font-montserrat text-sm text-gray-800 tracking-wide text-center mb-3">
          Make sure you are within 10 meters radius from the outlet and take
          attendance at the specified time!
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <AnimatedButton
            onClick={() => setShowIzinModal(true)}
            className="font-semibold w-full py-3 px-4 bg-[#E6EFF9] text-gray-600 font-montserrat rounded-xl text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-2 outline-white"
          >
            LEAVE / CLAIM DAY OFF
          </AnimatedButton>
          <AnimatedButton
            onClick={handleHadir}
            className="font-semibold w-full py-3 px-4 bg-[#57AEFF] text-white font-montserrat rounded-xl text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-2 outline-white"
          >
            PRESENT
          </AnimatedButton>
        </div>

        {/* Modal */}
        {showIzinModal && (
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center p-4 z-50
              ${showModalContent ? "bg-opacity-60" : "bg-opacity-0"}`}
          >
            <div
              className={`bg-[#E2F2FF] rounded-3xl p-6 w-full max-w-[320px] mx-4 sm:mx-auto transform transition-all duration-300
                ${
                  showModalContent
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-full scale-150"
                }`}
            >
              <h2 className="font-bebas text-2xl mb-4 text-center">
                REASON FOR LEAVE / DAY OFF
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <select
                  value={kategoriIzin}
                  onChange={(e) => setKategoriIzin(e.target.value)}
                  className="w-full p-3 pr-10 bg-[#E6EFF9] text-gray-600 font-montserrat rounded-xl text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-2 outline-white font-sm"
                >
                  <option value="">Pilih Kategori Izin</option>
                  {kategoriOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jika kategori izin adalah keperluan pribadi, maka tidak perlu isi alasan */}
              {kategoriIzin !== "keperluan_pribadi" && (
                <div>
                  <textarea
                    value={alasanIzin}
                    onChange={(e) => setAlasanIzin(e.target.value)}
                    // jka kategori izin adalah libur bersama, maka placeholder menjadi "Berikan alasan libur bersama..."
                    // jka kategori izin adalah sakit, maka placeholder menjadi "Berikan alasan sakit..." atau "Berikan alasan sakit..."
                    // jka kategori izin adalah keperluan pribadi, maka placeholder menjadi "Berikan alasan keperluan pribadi..."
                    placeholder={
                      kategoriIzin === "libur_bersama"
                        ? "Jelaskan kegiatan libur bersama..."
                        : kategoriIzin === "sakit"
                        ? "Jelaskan alasan sakit..."
                        : "Pilih alasan izin diatas!"
                    }
                    className="w-full h-24 p-3 border border-gray-200 rounded-2xl mb-4 font-montserrat text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#E6EFF9] shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-2 outline-white"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <AnimatedButton
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-montserrat rounded-xl text-sm hover:bg-gray-200 transition-colors font-semibold shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-2 outline-white"
                >
                  CANCEL
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleSubmitIzin}
                  className="flex-1 py-3 px-4 bg-[#57AEFF] text-white font-montserrat rounded-xl text-sm hover:bg-opacity-90 transition-colors font-semibold shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-2 outline-white"
                >
                  SEND
                </AnimatedButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Absensi;
