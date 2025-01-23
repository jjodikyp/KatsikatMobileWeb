import { useLocation } from "react-router-dom";

const PageTitle = () => {
  const location = useLocation();

  const getTitleByPath = () => {
    const path = location.pathname;

    if (path.includes("berandakasir")) {
      return "Beranda Kasir";
    } else if (path.includes("berandakurir")) {
      return "Beranda Kurir";
    } else if (path.includes("berandateknisi")) {
      return "Beranda Teknisi";
    }
    return null;
  };

  const title = getTitleByPath();
  
  // Jika title tidak ada judul page, return null
  if (!title) return null;

  return (
    <div className="mt-[8px] mx-auto h-[41px] max-w-[390px] bg-[#E6EFF9] shadow-inner shadow-white opacity-100 outline outline-2 outline-[white] py-2 px-4 rounded-full flex items-center justify-center w-full">
      <h1 className="font-bebas text-xl text-[#383838] text-center">
        {title}
      </h1>
    </div>
  );
};

export default PageTitle;
