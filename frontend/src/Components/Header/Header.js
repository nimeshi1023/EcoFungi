import React from "react";
import { UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png"; 

const Header = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("user")) || {};
  const username = storedUser.name || "Manager";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="backdrop-blur-md bg-green-200/60 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left side empty */}
       {/* 🍄 Logo */}
        <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-green-900">  EchoFungi  Mushroom Cultivation Management</span>
        </div>

        {/* Right side: profile & logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-10 w-10 text-green-800" />
            <span className="text-green-900 font-semibold">
              Welcome{" "}
              <button
                onClick={() => navigate("/profile")}
                className="underline hover:text-green-700"
              >
                {username}
              </button>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
