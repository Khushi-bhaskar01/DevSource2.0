import React from "react";

export default function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-6 sm:px-10 py-20">
      <h1 className="absolute top-12 right-10 text-4xl md:text-6xl font-[Zen_Dots] tracking-widest bg-linear-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
        ABOUT
      </h1>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full mt-12">

        <div className="flex items-center justify-center">
          <div className="w-48 h-48 sm:w-60 sm:h-60 rotate-45 bg-linear-to-b from-purple-500 to-pink-500 rounded-4xl flex items-center justify-center shadow-lg transition-transform duration-500 hover:scale-105">
            <div className="-rotate-45 text-center text-white font-semibold bg-white/10 backdrop-blur-md rounded-xl px-4 py-3">
              <p className="text-sm sm:text-base">
                VICE LEAD:
                <a
                  href="https://www.linkedin.com/in/krrish-khowal-150885311/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:text-sky-500 ml-1 underline underline-offset-2"
                >
                  KRRISH KHOWAL
                </a>
              </p>
              <a
                href="https://github.com/Krrish-29"
                target="_blank"
                rel="noreferrer"
                className="block text-xs sm:text-sm text-gray-700 hover:text-black mt-1"
              >
                github.com/Krrish-29
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rotate-45 bg-linear-to-b from-purple-400 to-pink-400 rounded-[3rem] flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-transform duration-500 hover:scale-105">
            <p className="-rotate-45 text-white text-xs sm:text-sm md:text-base font-light text-center px-4 sm:px-8 leading-relaxed">
              DevSource is a development club under ACM USICT, GGSIPU, dedicated
              to fostering a community of passionate tech enthusiasts. We focus
              on Web, App, and Game Development while encouraging Open Source
              contributions. Our mission is to help students learn, build, and
              grow through real-world projects, empowering them to become
              industry-ready innovators.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-48 h-48 sm:w-60 sm:h-60 rotate-45 bg-linear-to-b from-green-300 to-pink-400 rounded-4xl flex items-center justify-center shadow-lg transition-transform duration-500 hover:scale-105">
            <div className="-rotate-45 text-center text-black font-semibold bg-white/60 backdrop-blur-md rounded-xl px-4 py-3">
              
              <p className="text-sm sm:text-base">
                LEAD:
                <a
                  href="https://www.linkedin.com/in/khushi-bhaskar-b00586324/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-800 hover:text-sky-400 ml-1 underline underline-offset-2"
                >
                  KHUSHI BHASKAR
                </a>
              </p>
              <a
                href="https://github.com/Khushi-bhaskar01"
                target="_blank"
                rel="noreferrer"
                className="block text-xs sm:text-sm text-gray-800 hover:text-gray-500 mt-1"
              >
                github.com/Khushi-bhaskar01
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
