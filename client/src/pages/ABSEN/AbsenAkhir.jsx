import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LordIcon from "../../components/Design/LordIcon";
import AnimatedButton from "../../components/Design/AnimatedButton";

const AbsenAkhir = () => {
  const navigate = useNavigate();
  const [workDuration, setWorkDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [deskripsi, setDeskripsi] = useState("");
  const [error, setError] = useState("");

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
        detik: seconds,
      });

      setWorkDuration({ hours, minutes, seconds });
    } else {
      console.log("Tidak ada waktu mulai kerja yang tersimpan");
    }
  }, []);

  const handleSelesaiKerja = () => {
    // Validasi deskripsi
    const wordCount = deskripsi.trim().split(/\s+/).length;
    if (wordCount < 3) {
      setError("Deskripsi harus minimal 3 kata!");
      return;
    }

    // Hapus waktu mulai kerja dari localStorage
    localStorage.removeItem("workStartTime");
    sessionStorage.removeItem("fromPresent");
    sessionStorage.removeItem("fromIzin");
    // Arahkan ke halaman login
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-[390px] w-full flex flex-col items-center ">
        {/* Gambar */}
        <LordIcon
          src="https://cdn.lordicon.com/gdowkrjt.json"
          trigger="loop"
          state="loop-oscillate"
          style={{ width: "180px", height: "180px", marginTop: "-50px" }}
        />

        {/* Teks Terima Kasih */}
        <h2 className="text-3xl sm:text-3xl font-bebas font-normal text-gray-800 tracking-wide mb-2 mt-4">
          TERIMA KASIH
        </h2>

        {/* Pesan */}
        <p className="font-montserrat text-sm text-gray-600 text-center mb-6 max-w-xs">
          Kerja bagus! Terima kasih telah menyelesaikan pekerjaan anda selama,
        </p>

        {/* Durasi Kerja dengan detik */}
        <div className="bg-white rounded-2xl p-2 w-full mb-6 max-w-xs outline outline-2 outline-[#EEF1F7]">
          <p className="font-montserrat text-lg text-center text-gray-800">
            {workDuration.hours} Jam {workDuration.minutes} Menit{" "}
            {workDuration.seconds} Detik
          </p>
        </div>

        {/* Area Input Deskripsi */}
        <div className="w-full max-w-xs mb-6">
          <textarea
            value={deskripsi}
            onChange={(e) => {
              setDeskripsi(e.target.value);
              setError("");
            }}
            placeholder="Masukkan hasil evaluasi harian Anda! (min. 3 kata)"
            className="w-full p-4 font-montserrat text-sm rounded-2xl outline outline-2 outline-[#EEF1F7] resize-none h-30 text-gray-600"
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 font-montserrat">{error}</p>
          )}
        </div>

        {/* Button Selesai */}
        <AnimatedButton
          onClick={handleSelesaiKerja}
          variant="blue"
          className="max-w-xs w-full py-3 px-6 font-montserrat font-semibold rounded-2xl text-sm"
        >
          Absen Pulang
        </AnimatedButton>
      </div>
    </div>
  );
};

export default AbsenAkhir;
