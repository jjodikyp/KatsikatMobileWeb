import { useState, useEffect } from "react";
import axios from "axios";
import Header from '../components/Header';
import MonthYearPicker from '../components/MonthYearPicker';
import { useNavigate } from "react-router-dom";

const CekAbsen = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [absenData, setAbsenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const fetchAbsenReport = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Membuat data dummy untuk 31 hari
      const dummyData = Array.from({ length: 31 }, (_, index) => {
        const date = new Date(year, month - 1, index + 1);
        
        const statuses = ['hadir', 'izin', 'alpha'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const randomClockIn = new Date(date);
        randomClockIn.setHours(7 + Math.floor(Math.random() * 2));
        randomClockIn.setMinutes(Math.floor(Math.random() * 60));
        
        const randomClockOut = new Date(date);
        randomClockOut.setHours(16 + Math.floor(Math.random() * 2));
        randomClockOut.setMinutes(Math.floor(Math.random() * 60));

        return {
          date: date.toISOString(),
          clockIn: randomStatus === 'hadir' ? randomClockIn.toISOString() : null,
          clockOut: randomStatus === 'hadir' ? randomClockOut.toISOString() : null,
          status: randomStatus
        };
      });

      setAbsenData(dummyData);
    } catch (error) {
      console.error('Error fetching absen report:', error);
      setError("Gagal mengambil data absen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsenReport();
  }, [month, year]);

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return new Date(timeString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleBack = () => {
    navigate('/pilih-role');
  };

  const handleSetCurrentDate = () => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
  };

  const displayedData = showAll ? absenData : absenData?.slice(0, 5);

  // Fungsi untuk menghitung ringkasan kehadiran
  const calculateSummary = () => {
    if (!absenData) return null;

    const summary = {
      totalHadir: 0,
      totalAlpha: 0,
      totalIzin: 0,
      totalJamKerja: 0
    };

    absenData.forEach(absen => {
      switch (absen.status) {
        case 'hadir':
          summary.totalHadir++;
          // Hitung jam kerja jika hadir
          if (absen.clockIn && absen.clockOut) {
            const clockIn = new Date(absen.clockIn);
            const clockOut = new Date(absen.clockOut);
            const jamKerja = (clockOut - clockIn) / (1000 * 60 * 60); // Convert to hours
            summary.totalJamKerja += jamKerja;
          }
          break;
        case 'alpha':
          summary.totalAlpha++;
          break;
        case 'izin':
          summary.totalIzin++;
          break;
      }
    });

    return summary;
  };

  const summary = calculateSummary();

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#E6EFF9] font-montserrat">
      <Header />
      <main className="pt-24 px-4 md:px-10 pb-10 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="p-2 bg-[#E2F2FF] rounded-full shadow-[4px_4px_10px_rgba(0,0,0,0.15)] hover:bg-[#d5e9fa] transition-colors w-[41px] h-[41px] flex items-center justify-center outline outline-2 outline-white"
            title="Kembali ke Pilih Role"
          >
            <img 
              src="/src/assets/images/Home Button.gif" 
              alt="Beranda"
              className="w-5 h-5"
            />
          </button>
          <h1 className="text-2xl font-bebas">Daftar Kehadiran</h1>
        </div>
        
        {/* Month Year Picker */}
        <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mt-4 opacity-100 outline outline-1 outline-white">
          <h2 className="text-2xl font-bebas mb-3">Rentang Waktu</h2>
          <div className="flex gap-2">
            <input
              type="month"
              value={`${year}-${month < 10 ? '0' + month : month}`}
              onChange={(e) => {
                const [selectedYear, selectedMonth] = e.target.value.split('-');
                setYear(parseInt(selectedYear));
                setMonth(parseInt(selectedMonth));
              }}
              className="flex-1 bg-[#E6EFF9] text-gray-600 shadow shadow-white opacity-100 outline outline-1 outline-white w-full p-2 rounded-xl font-semibold"
            />
            <button
              onClick={handleSetCurrentDate}
              className="bg-[#57AEFF] text-white shadow shadow-white opacity-100 outline outline-1 outline-white px-4 rounded-xl font-semibold hover:bg-[#d5e9fa] transition-colors"
            >
              Sekarang
            </button>
          </div>
        </div>

        {/* Absen Report */}
        <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mt-4 opacity-100 outline outline-1 outline-white">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : !absenData || absenData.length === 0 ? (
            <div className="text-center py-4">Tidak ada data absen</div>
          ) : (
            <>
              <div className={`overflow-y-auto ${showAll ? 'max-h-[400px]' : ''}`}>
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#E2F2FF]">
                    <tr className="text-left">
                      <th className="p-2">Tanggal</th>
                      <th className="p-2">Jam Masuk</th>
                      <th className="p-2">Jam Selesai</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.map((absen, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-2">{formatDate(absen.date)}</td>
                        <td className="p-2">{formatTime(absen.clockIn)}</td>
                        <td className="p-2">{formatTime(absen.clockOut)}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            absen.status === 'hadir' ? 'bg-green-100 text-green-800 outline outline-1 outline-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)]' :
                            absen.status === 'izin' ? 'bg-yellow-100 text-yellow-800 outline outline-1 outline-white shadow-inner shadow-[4px_4px_10px_rgba(0,0,0,0.15)]' :
                            'bg-red-100 text-red-800 outline outline-1 outline-white shadow-inner shadow-[4px_4px_10px_rgba(0,0,0,0.15)]'
                          }`}>
                            {absen.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {absenData.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="bg-[#57AEFF] text-white px-4 py-2 rounded-xl hover:bg-[#4499e9] transition-colors shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white"
                  >
                    {showAll ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Semua'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Setelah Absen Report, tambahkan Ringkasan Kehadiran */}
        {!loading && !error && absenData && absenData.length > 0 && (
          <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mt-4 opacity-100 outline outline-1 outline-white">
            <h2 className="text-2xl font-bebas mb-3">Ringkasan Kehadiran</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Kehadiran</div>
                <div className="text-2xl font-semibold text-[#2E7CF6]">{summary?.totalHadir} Hari</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-inner shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Alpha</div>
                <div className="text-2xl font-semibold text-[#2E7CF6]">{summary?.totalAlpha} Hari</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-inner shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Izin</div>
                <div className="text-2xl font-semibold text-[#2E7CF6]">{summary?.totalIzin} Hari</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Jam Kerja</div>
                <div className="text-2xl font-semibold text-[#2E7CF6]">
                  {summary?.totalJamKerja.toFixed(1)} Jam
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CekAbsen;