import { useState } from 'react';
import ConfirmRoleModal from '../components/ConfirmRoleModal';

const PilihRole = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      alert('Please select a role first');
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white px-10 py-10">
      <div className="w-full sm:w-[380px] p-6 sm:p-8 my-auto bg-white rounded-3xl shadow-2xl shadow-grey opacity-100 outline outline-2 outline-white">
        <h1 className="text-2xl font-bebas text-center mb-2">SELECT YOUR ROLE</h1>
        <p className="text-center text-gray-600 mb-8 text-sm font-montserrat">
          Please select a role according to your job position
        </p>

        <div className="space-y-3">
          {/* Technician Button */}
          <button
            onClick={() => handleRoleSelect('teknisi')}
            className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 hover:shadow-md ${
              selectedRole === 'teknisi'
                ? 'border-[#57AEFF] bg-gradient-to-r from-blue-50 to-white shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedRole === 'teknisi' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke={selectedRole === 'teknisi' ? '#57AEFF' : 'currentColor'}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
            <div className="text-left font-montserrat">
              <h3 className="font-semibold text-sm">Technician</h3>
              <p className="text-[10px] text-gray-500">Role for service technician</p>
            </div>
          </button>

          {/* Cashier Button */}
          <button
            onClick={() => handleRoleSelect('kasir')}
            className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 hover:shadow-md ${
              selectedRole === 'kasir'
                ? 'border-[#57AEFF] bg-gradient-to-r from-blue-50 to-white shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedRole === 'kasir' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke={selectedRole === 'kasir' ? '#57AEFF' : 'currentColor'}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
            </div>
            <div className="text-left font-montserrat">
              <h3 className="font-semibold text-sm">Cashier</h3>
              <p className="text-[10px] text-gray-500">Role for cashier operations</p>
            </div>
          </button>

          {/* Courier Button */}
          <button
            onClick={() => handleRoleSelect('kurir')}
            className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 hover:shadow-md ${
              selectedRole === 'kurir'
                ? 'border-[#57AEFF] bg-gradient-to-r from-blue-50 to-white shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedRole === 'kurir' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke={selectedRole === 'kurir' ? '#57AEFF' : 'currentColor'}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>
            <div className="text-left font-montserrat">
              <h3 className="font-semibold text-sm">Courier</h3>
              <p className="text-[10px] text-gray-500">Role for delivery services</p>
            </div>
          </button>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 px-4 bg-[#57AEFF] text-white font-montserrat rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-colors shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white mt-6"
        >
          Continue
        </button>
      </div>

      <ConfirmRoleModal
        isOpen={showModal}
        onClose={handleCloseModal}
        selectedRole={selectedRole}
      />
    </div>
  );
};

export default PilihRole; 