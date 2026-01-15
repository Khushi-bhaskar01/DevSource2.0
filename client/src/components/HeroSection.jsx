import heroImage from "../assets/hero.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-30 bg-linear-to-r from-[#8B00FF] via-[#C850C0] to-[#FF69B4] text-white overflow-hidden">
      
      {/* LEFT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl space-y-5 z-10"
      >
        <p className="text-sm uppercase text-[#ffbdf2] tracking-[0.2em] font-[Zen_Dots]">
          Development Agency
        </p>

        <h1 className="text-4xl md:text-5xl font-[Courier New] leading-tight">
          Fueling student devs to ship 🚀 <br />
          <span className="text-yellow-400">real-world projects</span>
        </h1>

        <p className="text-[#e0d7ff] text-lg font-[Zen_Dots]">
          Innovative Development Solutions for a Dynamic World
        </p>

        {/* BUTTONS */}
        <div className="flex gap-5 mt-8">
          {/* Go to Tasks page */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tasks")}
            className="bg-linear-to-r from-[#FFD700] to-[#FF007F] text-black px-6 py-2 rounded-md font-semibold shadow-md"
          >
            Start Your Project Now
          </motion.button>

          {/* Scroll to About section */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="border-2 border-[#FFD700] text-white px-6 py-2 rounded-md hover:bg-[#ff007f]/20 transition"
          >
            Read More
          </motion.button>
        </div>
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-10 md:mt-0 w-full md:w-1/2 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-linear-to-r from-pink-500 via-purple-600 to-orange-400 opacity-40 blur-[120px] rounded-full"></div>

          <img
            src={heroImage}
            alt="Developer Illustration"
            className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
