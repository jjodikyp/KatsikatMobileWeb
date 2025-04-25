import { useEffect, useState, useRef } from "react";
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

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

  // Fungsi untuk mengecek dan meminta akses kamera
  const initializeCamera = async () => {
    try {
      // Polyfill untuk browser yang lebih lama
      const getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia ||
                         (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

      if (!getUserMedia) {
        throw new Error('Kamera tidak didukung di browser ini');
      }

      let stream;
      
      // Menggunakan modern API jika tersedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: false
        });
      } else {
        // Fallback untuk browser lama
        stream = await new Promise((resolve, reject) => {
          getUserMedia.call(navigator, 
            { video: true, audio: false },
            resolve,
            reject
          );
        });
      }

      if (videoRef.current) {
        // Fallback untuk browser lama
        if ('srcObject' in videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          // Fallback untuk browser yang lebih lama
          videoRef.current.src = window.URL.createObjectURL(stream);
        }
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };

        setStream(stream);
        setCameraError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? 'Mohon izinkan akses kamera untuk melakukan absensi'
          : 'Tidak dapat mengakses kamera. Silakan cek pengaturan browser Anda'
      );
    }
  };

  // Effect untuk setup kamera
  useEffect(() => {
    initializeCamera();

    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Fungsi untuk mengambil foto
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;

      try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageData(dataUrl);
      } catch (err) {
        console.error('Error capturing image:', err);
        setCameraError('Gagal mengambil gambar. Silakan coba lagi.');
      }
    }
  };

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
      <div className="max-w-[390px] w-full flex flex-col items-center">
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

        {/* Camera Section */}
        <div className="w-full max-w-xs mb-6">
          <div className="relative rounded-2xl overflow-hidden outline outline-2 outline-[#EEF1F7]">
            {cameraError ? (
              <div className="bg-red-50 p-4 rounded-2xl">
                <p className="text-red-600 text-sm font-montserrat text-center">{cameraError}</p>
                <button
                  onClick={() => {
                    setCameraError(null);
                    initializeCamera();
                  }}
                  className="mt-2 text-blue-600 text-sm font-montserrat underline w-full"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-2xl"
                  style={{ display: imageData ? 'none' : 'block' }}
                />
                
                {imageData && (
                  <div className="relative">
                    <img
                      src={imageData}
                      alt="captured"
                      className="w-full rounded-2xl"
                    />
                    <button
                      onClick={() => {
                        setImageData(null);
                        initializeCamera();
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {!imageData && (
                  <button
                    onClick={takeSnapshot}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-full border-4 border-[#2E7CF6]"></div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Hidden canvas for capturing */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

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
          disabled={!imageData}
        >
          Absen Pulang
        </AnimatedButton>
      </div>
    </div>
  );
};

export default AbsenAkhir;
