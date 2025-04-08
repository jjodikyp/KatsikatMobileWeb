import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedButton from '../Design/AnimatedButton';

const QualityCheckModal = ({ 
  isOpen, 
  onClose, 
  type,
  onSubmit 
}) => {
  const [reason, setReason] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const handleSubmit = () => {
    if (type === 'failed') {
      onSubmit({ status: 'failed', reason });
    } else {
      onSubmit({
        status: 'passed',
        deliveryOption,
        deliveryDateTime: deliveryOption === 'delivery' ? `${deliveryDate} ${deliveryTime}` : null
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 pl-10 pr-10">
            {/* Background overlay dengan animasi fade */}
            <motion.div 
              className="fixed inset-0 bg-black transition-opacity z-[101]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0, ease: "easeInOut"}}
              aria-hidden="true"
              onClick={onClose}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal content dengan animasi */}
            <motion.div 
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg w-full z-[102]"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#5096FC] to-[#7BD1FD] px-6 py-3">
                <h3 className="text-lg font-semibold text-white">
                  {type === 'failed' ? 'Tidak Lolos Quality Check' : 'Lolos Quality Check'}
                </h3>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                {type === 'failed' ? (
                  // Form untuk Tidak Lolos
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Berikan alasan tidak lolos quality check:
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder:text-sm"
                      rows="4"
                      placeholder="Alasan akan dibaca oleh pihak teknisi yang mengerjakan item ini..."
                    />
                  </div>
                ) : (
                  // Form untuk Lolos
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Pilih metode pengambilan:
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <AnimatedButton
                          className={`cursor-pointer p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                            deliveryOption === 'pickup'
                              ? 'bg-[#57AEFF] text-white'
                              : 'bg-[#E6EFF9] text-gray-600'
                          }`}
                          onClick={() => setDeliveryOption('pickup')}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-8 h-8"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" 
                            />
                          </svg>
                          <span className="text-sm font-medium">Ambil di Outlet</span>
                        </AnimatedButton>

                        <AnimatedButton
                          className={`cursor-pointer p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                            deliveryOption === 'delivery'
                              ? 'bg-[#57AEFF] text-white'
                              : 'bg-[#E6EFF9] text-gray-600'
                          }`}
                          onClick={() => setDeliveryOption('delivery')}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-8 h-8"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" 
                            />
                          </svg>
                          <span className="text-sm font-medium">Lakukan Pengiriman</span>
                        </AnimatedButton>
                      </div>
                    </div>

                    {deliveryOption === 'delivery' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih tanggal pengiriman:
                          </label>
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#57AEFF]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih waktu pengiriman:
                          </label>
                          <input
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#57AEFF]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
                <AnimatedButton
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-black opacity-100 outline outline-1 outline-black font-semibold"
                >
                  Batal
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleSubmit}
                  variant="blue"
                  disabled={
                    (type === 'failed' && !reason) ||
                    (type === 'passed' && !deliveryOption) ||
                    (deliveryOption === 'delivery' && (!deliveryDate || !deliveryTime))
                  }
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    ((type === 'failed' && reason) ||
                    (type === 'passed' && deliveryOption && 
                      (deliveryOption === 'pickup' || (deliveryDate && deliveryTime))))
                      ? 'bg-[#57AEFF] hover:bg-[#4a91d8]'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Konfirmasi
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QualityCheckModal;