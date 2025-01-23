import { useState, useEffect } from 'react';
import Header from '../../components/Com Header/Header';
import { useNavigate } from 'react-router-dom';
import LordIcon from '../../components/Design/LordIcon';
import AnimatedButton from '../../components/Design/AnimatedButton';

const KontrolKerja = ({ hideBackButton, hideTitle, className = "pt-24", wrapperMode }) => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Data dummy
      const dummyData = {
        kehadiran: {
          totalHadir: 18,
          totalAlpha: 2,
          totalIzin: 2,
          totalJamKerja: 144, // 18 hari x 8 jam
        },
        kinerja: {
          totalKerjaanSelesai: 45,
          pendapatan: 2500000,
          potongan: 450000,
          suratPeringatan: 2 // Indikator SP (1-3)
        }
      };

      setSummaryData(dummyData);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, [month, year]);

  const handleBack = () => {
    const previousPage = sessionStorage.getItem('previousPage');
    
    // Default ke beranda teknisi jika tidak ada previous page
    if (!previousPage) {
      navigate('/berandateknisi');
      return;
    }

    // Navigasi ke halaman sebelumnya berdasarkan path yang tersimpan
    switch (previousPage) {
      case '/berandakurir':
        navigate('/berandakurir');
        break;
      case '/berandakasir':
        navigate('/berandakasir');
        break;
      case '/berandateknisi':
        navigate('/berandateknisi');
        break;
      default:
        navigate('/berandateknisi');
    }
  };

  const handleSetCurrentDate = () => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (wrapperMode) {
    return (
      <div>
        {/* ... existing wrapper mode content ... */}
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#E6EFF9] font-montserrat">
      <Header />
      <main className={`${className} px-4 md:px-10 pb-10 flex-1 overflow-y-auto`}>
        {!hideBackButton && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
              className="p-2 bg-[#E2F2FF] rounded-full shadow-[4px_4px_10px_rgba(0,0,0,0.15)] hover:bg-[#d5e9fa] transition-colors w-[41px] h-[41px] flex items-center justify-center outline outline-2 outline-white"
              title="Kembali"
            >
              <LordIcon 
                src="https://cdn.lordicon.com/jeuxydnh.json"
                trigger="loop"
                colors="primary:#57AEFF"
                style={{width: 41, height: 41}}
              />
            </button>
            {!hideTitle && <h1 className="text-2xl font-bebas">Kontrol Kinerja & SP</h1>}
          </div>
        )}

        {/* Section 1: Rentang Waktu */}
        <div className="mb-4 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white">
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
            <AnimatedButton
              onClick={handleSetCurrentDate}
              className="bg-[#57AEFF] text-white shadow shadow-white opacity-100 outline outline-1 outline-white px-4 rounded-xl font-semibold hover:bg-[#4499e9] transition-colors"
            >
              Sekarang
            </AnimatedButton>
          </div>
        </div>

        {/* Section 2: Ringkasan Keseluruhan */}
        {!loading && summaryData && (
          <div className="bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white">
            <h2 className="text-2xl font-bebas mb-3">Ringkasan Keseluruhan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kehadiran */}
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Kehadiran</div>
                <div className="text-2xl font-semibold text-green-600">{summaryData.kehadiran.totalHadir} Hari</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Alpha</div>
                <div className="text-2xl font-semibold text-red-600">{summaryData.kehadiran.totalAlpha} Hari</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Izin</div>
                <div className="text-2xl font-semibold text-yellow-600">{summaryData.kehadiran.totalIzin} Hari</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Jam Kerja</div>
                <div className="text-2xl font-semibold text-blue-600">{summaryData.kehadiran.totalJamKerja} Jam</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Kerjaan Selesai</div>
                <div className="text-2xl font-semibold text-purple-600">{summaryData.kinerja.totalKerjaanSelesai} Task</div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Pendapatan</div>
                <div className="text-2xl font-semibold text-emerald-600">
                  {formatCurrency(summaryData.kinerja.pendapatan - summaryData.kinerja.potongan)}
                </div>
              </div>
            </div>

            {/* Status SP */}
            <div className="mt-4 bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
              <div className="text-sm text-gray-600 mb-2">Status Surat Peringatan</div>
              <div className="flex gap-2">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 h-3 rounded-full ${
                      level <= summaryData.kinerja.suratPeringatan
                        ? 'bg-red-500'
                        : 'bg-gray-200'
                    }`}
                    title={`SP ${level}`}
                  />
                ))}
              </div>
              <div className="text-sm text-red-600 mt-1">
                {summaryData.kinerja.suratPeringatan > 0
                  ? `Surat Peringatan ${summaryData.kinerja.suratPeringatan}`
                  : 'Tidak Ada Surat Peringatan'}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default KontrolKerja; 