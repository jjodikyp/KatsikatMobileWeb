import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';

const AntrianKurirContent = ({ 
  filteredAntrian, 
  type,
  searchQuery, 
  handleWhatsApp, 
  handleStartDelivery,
  handleCancelDelivery,
  handleCompleteDelivery 
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const getWhatsAppMessage = (type) => {
    const action = type === 'pickup' ? 'Menjemput' : 'Mengantar';
    return encodeURIComponent(`Halo kak, saya driver Katsikat yang akan ${action} item kakak. Mohon ditunggu ya kak, Terima kasih!`);
  };

  const getButtonText = (type) => {
    return type === 'pickup' ? 'Mulai Penjemputan' : 'Mulai Pengantaran';
  };

  const handleCopyAddress = (id, address) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset setelah 2 detik
  };

  return (
    <div className="max-w-[390px] md:max-w-none mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
        {filteredAntrian.length > 0 ? (
          filteredAntrian.map((item) => (
            <div
              key={item.id}
              className="bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-lg md:text-xl truncate">
                  {item.customerName}
                </p>
                <div className="flex items-start gap-2 mt-2">
                  <p className="text-sm md:text-base text-gray-600 line-clamp-2 flex-1">
                    {item.address}
                  </p>
                  <button
                    onClick={() => handleCopyAddress(item.id, item.address)}
                    className="mt-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Salin alamat"
                  >
                    {copiedId === item.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                      </svg>
                    )}
                  </button>
                </div>
                <a
                  href={item.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                >
                  Buka di Google Maps
                </a>
                <p className="text-sm text-gray-500 mt-2 font-bold">
                  Time Request: {format(item.requestTime, "HH:mm", { locale: id })}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => handleWhatsApp(item.phone, getWhatsAppMessage(type))}
                  className="w-[41px] h-[41px] rounded-2xl flex items-center justify-center bg-[#25D366] text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] hover:bg-opacity-90 transition-all outline outline-1 outline-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                </button>
                {item.status === 'ongoing' ? (
                  <>
                    <button
                      onClick={() => handleCancelDelivery(item.id)}
                      className="flex-1 h-[41px] rounded-xl flex items-center justify-center text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] font-semibold bg-red-500 text-white opacity-100 outline outline-1 outline-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleCompleteDelivery(item.id)}
                      className="flex-1 h-[41px] rounded-xl flex items-center justify-center text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] font-semibold bg-[#57AEFF] text-white opacity-100 outline outline-1 outline-white"
                    >
                      Selesai
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartDelivery(item.id)}
                    className="flex-1 h-[41px] rounded-xl flex items-center justify-center text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] font-semibold bg-[#57AEFF] text-white opacity-100 outline outline-1 outline-white"
                  >
                    {getButtonText(type)}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchQuery.trim() !== "" 
              ? "Tidak ada data yang sesuai dengan pencarian"
              : "Tidak ada antrian pengantaran"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AntrianKurirContent; 