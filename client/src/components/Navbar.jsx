// import { Link, useLocation, useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import { Menu, X, User, LogOut } from "lucide-react";

// const navigationItems = [
//   { label: "Home", path: "/" },
//   { label: "Members", path: "/members" },
//   { label: "Projects Wall", path: "/projects" },
//   { label: "Task", path: "/task" },
//   { label: "Leaderboard", path: "/leaderboard" },
// ];

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState(null);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // FIX: Load login state once on mount
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const uid = localStorage.getItem("userId");

//     if (token && uid) {
//       setIsLoggedIn(true);
//       setUserId(uid);
//     } else {
//       setIsLoggedIn(false);
//       setUserId(null);
//     }
//   }, []);

//   // PROFILE PATH
//   const profilePath = isLoggedIn ? `/profile/${userId}` : "/login";

//   // LOGOUT
//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userId");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   return (
//     <header className="fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
//       <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 h-20 flex items-center justify-between">

//         {/* LOGO */}
//         <div className="flex items-center gap-3">
//           <img src="/logo.png" alt="DevSource Logo" className="w-10 h-10" />
//           <h1 className="text-white font-[Zen_Dots] text-xl md:text-2xl">DevSource</h1>
//         </div>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center gap-8">
//           {navigationItems.map((item) => (
//             <Link
//               key={item.label}
//               to={item.path}
//               className={`relative font-[Zen_Dots] text-sm transition-all duration-300 ${
//                 location.pathname === item.path
//                   ? "text-[#ff81cc]"
//                   : "text-white hover:text-[#ff81cc]"
//               }`}
//             >
//               {item.label}
//               {location.pathname === item.path && (
//                 <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff81cc] rounded-full"></span>
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* Profile + Logout */}
//         <div className="flex items-center gap-4">
//           {isLoggedIn && (
//             <button
//               onClick={handleLogout}
//               className="hidden md:flex w-9 h-9 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 items-center justify-center transition"
//             >
//               <LogOut size={18} />
//             </button>
//           )}

//           <Link
//             to={profilePath}
//             className="hidden md:flex w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition"
//           >
//             <User size={18} className="text-white" />
//           </Link>

//           {/* Mobile Menu */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-white p-2 rounded hover:bg-white/10 transition"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-black/95 border-t border-gray-700 px-4 py-4 space-y-3">
//           {navigationItems.map((item) => (
//             <Link
//               key={item.label}
//               to={item.path}
//               onClick={() => setIsOpen(false)}
//               className={`block font-[Zen_Dots] text-sm ${
//                 location.pathname === item.path
//                   ? "text-[#ff81cc]"
//                   : "text-white hover:text-[#ff81cc]"
//               }`}
//             >
//               {item.label}
//             </Link>
//           ))}

//           {/* Mobile Profile */}
//           <Link
//             to={profilePath}
//             onClick={() => setIsOpen(false)}
//             className="flex items-center gap-2 mt-4 text-white hover:text-[#ff81cc] font-[Zen_Dots]"
//           >
//             <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
//               <User size={18} />
//             </div>
//             <span>Profile</span>
//           </Link>

//           {/* Mobile Logout */}
//           {isLoggedIn && (
//             <button
//               onClick={() => {
//                 handleLogout();
//                 setIsOpen(false);
//               }}
//               className="flex items-center gap-2 mt-3 text-red-400 hover:text-red-500 font-[Zen_Dots]"
//             >
//               <LogOut size={18} />
//               <span>Logout</span>
//             </button>
//           )}
//         </div>
//       )}
//     </header>
//   );
// }

// newww

import { useAuth } from "../AuthContext";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Members", path: "/members" },
  { label: "Projects Wall", path: "/projects" },
  { label: "Task", path: "/tasks" },
  { label: "Leaderboard", path: "/leaderboard" },
];

export default function Navbar() {
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;
  // Private editable profile for logged-in users
  const profilePath = userId ? `/profile` : "/login";
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="DevSource Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-white font-[Zen_Dots] text-xl md:text-2xl">
            DevSource
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`relative font-[Zen_Dots] text-sm transition-all duration-300 ${
                location.pathname === item.path
                  ? "text-[#ff81cc]"
                  : "text-white hover:text-[#ff81cc]"
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff81cc] rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Profile Icon */}
        <div className="hidden md:flex items-center">
          <Link
            to={profilePath}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <User className="text-white" size={18} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 rounded hover:bg-white/10 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-700 px-4 py-4 space-y-3">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`block font-[Zen_Dots] text-sm ${
                location.pathname === item.path
                  ? "text-[#ff81cc]"
                  : "text-white hover:text-[#ff81cc]"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Profile */}
          <Link
            to={profilePath}
            className="flex items-center gap-2 mt-4 text-white hover:text-[#ff81cc] font-[Zen_Dots]"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <User size={18} />
            </div>
            <span>Profile</span>
          </Link>
        </div>
      )}
    </header>
  );
}
