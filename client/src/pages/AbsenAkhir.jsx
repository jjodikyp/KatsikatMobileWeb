import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import seeImage from "../assets/images/see.png";

const AbsenAkhir = () => {
  const navigate = useNavigate();
  const [workDuration, setWorkDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Ambil waktu mulai kerja dari localStorage
    const startTime = localStorage.getItem("workStartTime");
    
    if (startTime) {
      const start = new Date(startTime);
      const end = new Date();
      
      // Hitung durasi dalam milidetik
      const duration = end - start;
      
      // Konversi ke jam, menit, dan detik
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((duration % (1000 * 60)) / 1000);
      
      // Tambahkan console log
      console.log("Perhitungan durasi kerja:", {
        waktuMulai: start.toLocaleString(),
        waktuSelesai: end.toLocaleString(),
        durasiMilidetik: duration,
        jam: hours,
        menit: minutes,
        detik: seconds
      });
      
      setWorkDuration({ hours, minutes, seconds });
    } else {
      console.log("Tidak ada waktu mulai kerja yang tersimpan");
    }
  }, []);

  const handleSelesaiKerja = () => {
    // Hapus waktu mulai kerja dari localStorage
    localStorage.removeItem("workStartTime");
    // Arahkan ke halaman login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-[390px] w-full flex flex-col items-center">
        {/* Gambar */}
        <img
          src={seeImage}
          alt="Thank You"
          className="w-[180px] h-auto mb-6"
        />

        {/* Teks Terima Kasih */}
        <h2 className="text-3xl sm:text-3xl font-bebas font-normal text-gray-800 tracking-wide mb-2">
          TERIMA KASIH
        </h2>
        
        {/* Pesan */}
        <p className="font-montserrat text-sm text-gray-600 text-center mb-6 max-w-xs">
          Kerja bagus! Terima kasih telah menyelesaikan pekerjaan anda selama,
        </p>

        {/* Durasi Kerja dengan detik */}
        <div className="bg-gray-50 rounded-3xl p-2 w-full mb-6 max-w-xs shadow-xl">
          <p className="font-montserrat text-lg text-center text-gray-800">
            {workDuration.hours} Jam {workDuration.minutes} Menit {workDuration.seconds} Detik
          </p>
        </div>

        {/* Button Selesai */}
        <button
          onClick={handleSelesaiKerja}
          className="w-max-xs py-3.5 px-4 bg-[#51A7D9] text-white font-montserrat rounded-xl hover:bg-[#2F82B2] transition-colors duration-200 text-sm"
        >
          SELESAI KERJA
        </button>
      </div>
    </div>
  );
};

export default AbsenAkhir; 