import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedButton from "../Design/AnimatedButton";

const TreatmentDetailModal = ({
  isOpen,
  onClose,
  treatment,
  description,
  isStarted,
  duration,
  onStart,
  onCancel,
  treatmentId,
}) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = async () => {
    try {
      // Akan memanggil API untuk memulai timer di backend
      await onStart(treatmentId);
    } catch (error) {
      console.error("Error starting treatment:", error);
    }
  };

  const handleCancel = async () => {
    try {
      // Akan memanggil API untuk menghapus timer di backend
      await onCancel(treatmentId);
    } catch (error) {
      console.error("Error canceling treatment:", error);
    }
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
          <div className="flex items-center justify-center min-h-screen px-10 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              className="fixed inset-0 bg-black transition-opacity z-[101]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0, ease: "easeInOut" }}
              aria-hidden="true"
              onClick={onClose}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <motion.div
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg w-full z-[102]"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#5096FC] to-[#7BD1FD] px-6 py-3">
                <h3 className="text-lg font-semibold text-white">
                  Detail Treatment
                </h3>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">{treatment}</h4>
                  <p className="text-gray-600 text-sm">{description}</p>
                </div>

                <div className="flex gap-2">
                  {!isStarted ? (
                    <AnimatedButton
                      onClick={handleStart}
                      className="w-full px-4 py-2 bg-[#57AEFF] text-white rounded-xl hover:bg-[#4499e9] transition-colors"
                    >
                      Mulai Sekarang
                    </AnimatedButton>
                  ) : (
                    <>
                      <div className="flex-1 px-4 py-2 bg-[#E6EFF9] text-[#2E7CF6] rounded-xl font-semibold text-center">
                        {formatDuration(duration)}
                      </div>
                      <AnimatedButton
                        onClick={handleCancel}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </AnimatedButton>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TreatmentDetailModal;
