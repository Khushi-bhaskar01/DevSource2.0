// import React, { useState } from "react";
// import { Menu, X, User } from "lucide-react";

// const navigationItems = [
//   { label: "Home", href: "#home" },
//   { label: "Members", href: "#members" },
//   { label: "Projects Wall", href: "#projects" },
//   { label: "Task", href: "#task" },
//   { label: "Leaderboard", href: "#leaderboard" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm">
//       <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
//         <h1 className="text-white font-[Zen_Dots] text-xl md:text-2xl tracking-wide">
//           DevSource 🔥
//         </h1>

//         <nav className="hidden md:flex items-center gap-10">
//           {navigationItems.map((item) => (
//             <a
//               key={item.label}
//               href={item.href}
//               className="font-[Zen_Dots] text-sm text-white hover:text-[#54213f] transition-colors duration-300"
//             >
//               {item.label}
//             </a>
//           ))}
//         </nav>

//         <div className="hidden md:flex items-center gap-4">
//           <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-[#ff81cc]/60 transition">
//             <User className="text-white" size={20} />
//           </div>
//         </div>
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           aria-label="Toggle menu"
//           className="block md:hidden text-white p-2 rounded hover:bg-white/10 transition"
//         >
//           {isOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {isOpen && (
//         <div className="md:hidden bg-black/90 border-t border-gray-700 px-6 py-4 space-y-3">
//           {navigationItems.map((item) => (
//             <a
//               key={item.label}
//               href={item.href}
//               className="block font-[Zen_Dots] text-sm text-white hover:text-[#ff81cc] transition-colors"
//               onClick={() => setIsOpen(false)}
//             >
//               {item.label}
//             </a>
//           ))}

//           <div className="pt-4 border-t border-gray-700 flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
//               <User className="text-white" size={18} />
//             </div>
//             <span className="text-white text-sm font-[Zen_Dots]">Profile</span>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";

const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "Members", href: "#members" },
  { label: "Projects Wall", href: "#projects" },
  { label: "Task", href: "#task" },
  { label: "Leaderboard", href: "#leaderboard" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="DevSource Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-white font-[Zen_Dots] text-xl md:text-2xl">DevSource</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-[Zen_Dots] text-sm text-white hover:text-[#ff81cc] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side: profile or mobile toggle */}
        <div className="flex items-center gap-4">
          {/* profile shown only on md+ */}
          <div className="hidden md:flex items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <User className="text-white" size={18} />
            </div>
          </div>

          {/* mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-700 px-4 py-4 space-y-3">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block font-[Zen_Dots] text-sm text-white hover:text-[#ff81cc]"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
