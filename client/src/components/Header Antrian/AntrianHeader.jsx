import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import ClockGroup from "../Com Header/ClockGroup";
import AnimatedButton from "../Design/AnimatedButton";

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
      <AnimatedButton
        onClick={() => navigate(-1)}
        className="w-[41px] h-[41px] rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg outline outline-1 outline-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.0}
          stroke="black" 
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </AnimatedButton>

      {/* Current Time Display */}
      <ClockGroup />
    </div>
  );
};

export default AntrianHeader; 