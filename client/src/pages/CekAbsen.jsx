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

  const fetchAbsenReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/absen/report`, {
        params: {
          userId: userData.id,
          month,
          year
        }
      });

      setAbsenData(response.data.data);
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

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#E6EFF9] font-montserrat">
      <Header />
      <main className="pt-24 px-4 md:px-10">
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
          <h1 className="text-2xl font-bebas">Cek Absen Bulanan</h1>
        </div>
        
        {/* Month Year Picker */}
        <div className="mb-2 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mt-4 opacity-100 outline outline-1 outline-white">
          <h2 className="text-2xl font-bebas mb-3">Rentang Waktu</h2>
          <input
            type="month"
            value={`${year}-${month < 10 ? '0' + month : month}`}
            onChange={(e) => {
              const [selectedYear, selectedMonth] = e.target.value.split('-');
              setYear(parseInt(selectedYear));
              setMonth(parseInt(selectedMonth));
            }}
            className="bg-[#E6EFF9] text-gray-600 shadow shadow-white opacity-100 outline outline-1 outline-white w-full p-2 rounded-xl font-semibold"
          />
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Tanggal</th>
                    <th className="p-2">Jam Masuk</th>
                    <th className="p-2">Jam Selesai</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {absenData.map((absen, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-2">{formatDate(absen.date)}</td>
                      <td className="p-2">{formatTime(absen.clockIn)}</td>
                      <td className="p-2">{formatTime(absen.clockOut)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          absen.status === 'hadir' ? 'bg-green-100 text-green-800' :
                          absen.status === 'izin' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {absen.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CekAbsen;