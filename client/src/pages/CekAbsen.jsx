import { useState, useEffect } from "react";
import axios from "axios";
import Header from '../components/Header';
import MonthYearPicker from '../components/MonthYearPicker';

const CekAbsen = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [absenData, setAbsenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

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

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <Header />
      <main className="pt-24 px-4 md:px-10">
        <h1 className="text-2xl font-bebas mb-4">Cek Absen</h1>
        
        {/* Month Year Picker */}
        <div className="bg-[#F0F0F0] rounded-3xl p-4 shadow-sm mb-6">
          <MonthYearPicker
            month={month}
            year={year}
            onMonthChange={(value) => setMonth(parseInt(value))}
            onYearChange={(value) => setYear(parseInt(value))}
          />
        </div>

        {/* Absen Report */}
        <div className="bg-[#F0F0F0] rounded-3xl p-4 shadow-sm">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : absenData.length === 0 ? (
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