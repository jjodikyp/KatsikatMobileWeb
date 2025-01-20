import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";

const AntrianHeader = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto px-4 py-4 pr-4 pl-4 md:px-10 flex justify-between items-center max-w-[390px] md:max-w-none">
      {/* Back Button dengan icon yang lebih menarik */}
      <button
        onClick={() => navigate(-1)}
        className="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-[#E2F2FF] hover:bg-opacity-90 transition-all shadow-lg outline outline-2 outline-[#57AEFF]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="#57AEFF" 
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      {/* Current Time Display */}
      <div className="flex items-center gap-4 bg-[#E2F2FF] px-6 py-2 rounded-full shadow-md outline outline-2 outline-[#57AEFF]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="#57AEFF"
          className="w-4 h-4"
        >
          <circle cx="12" cy="12" r="10" stroke="#57AEFF" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4"
          />
        </svg>
        <span className="font-bebas text-xl text-[#57AEFF]">
          {format(currentTime, "HH:mm:ss", { locale: id })}
        </span>
      </div>
    </div>
  );
};

export default AntrianHeader; 