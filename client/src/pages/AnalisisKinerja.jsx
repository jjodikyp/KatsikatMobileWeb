import { useState } from 'react';
import Header from '../components/Com Header/Header';
import CekAbsen from './CekAbsen';
import CekGaji from './CekGaji';
import KontrolKerja from './KontrolKerja';
import React from 'react';

const ContentWrapper = ({ children }) => {
  const modifiedChild = React.cloneElement(children, {
    hideBackButton: true,
    hideTitle: true,
    className: "pt-0",
    wrapperMode: true
  });

  return modifiedChild;
};

const AnalisisKinerja = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const menuItems = [
    { 
      name: 'Daftar Kehadiran', 
      path: 'cekabsen',
      icon: "/src/assets/images/calender.png",
      component: CekAbsen
    },
    { 
      name: 'Penghasilan & Slip Gaji', 
      path: 'cekgaji',
      icon: "/src/assets/images/salary.png",
      component: CekGaji
    },
    { 
      name: 'Kontrol Kinerja & SP', 
      path: 'kontrolkerja',
      icon: "/src/assets/images/chart.png",
      component: KontrolKerja
    },
  ];

  const renderContent = () => {
    if (!selectedMenu) return null;
    
    const MenuItem = menuItems.find(item => item.path === selectedMenu)?.component;
    if (!MenuItem) return null;

    return (
      <ContentWrapper>
        <MenuItem />
      </ContentWrapper>
    );
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#E6EFF9] font-montserrat">
      <Header />
      <div className="fixed top-24 left-5 right-5 z-10 bg-[#E6EFF9] pb-4">
        <div className="max-w-[390px] mx-auto">
          <div className="bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white">
            <h2 className="text-2xl font-bebas mb-4">Analisis Kinerja</h2>
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => setSelectedMenu(item.path)}
                  className={`h-[45px] w-full text-left px-4 py-3 rounded-xl transition-colors font-montserrat text-sm bg-[#E6EFF9] shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 ${
                    selectedMenu === item.path 
                      ? 'outline-[#57AEFF] bg-[#d5e9fa]' 
                      : 'outline-[#57AEFF] hover:bg-gray-100'
                  } flex items-center justify-start`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.icon}
                      alt={item.name}
                      className="w-6 h-6"
                    />
                    {item.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="pt-[340px] px-4 md:px-10 pb-10 flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[450px]">
          {selectedMenu && renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AnalisisKinerja; 