// src/components/Layout.jsx
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export default function Layout({ children }) {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <header className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo} // Change to your actual logo path if needed
            alt=" QPcreator logo"
            className="w-28 sm:w-32 object-contain"
          />
          
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
