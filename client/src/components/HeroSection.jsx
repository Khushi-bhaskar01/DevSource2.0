import heroImage from "../assets/hero.png";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20 bg-gradient-to-r from-[#8B00FF] via-[#C850C0] to-[#FF69B4] text-white overflow-hidden">
      <div className="max-w-xl space-y-5 z-10">
        <p className="text-sm uppercase text-[#ffbdf2] tracking-[0.2em] font-[Zen_Dots]">
          Development Agency
        </p>

        <h1 className="text-4xl md:text-5xl font-[Zen_Dots] leading-tight">
          Fueling student devs to ship <br />
          real-world projects <span className="text-yellow-400">🔥🚀</span>
        </h1>

        <p className="text-[#e0d7ff] text-lg font-[Zen_Dots]">
          Innovative Development Solutions for a Dynamic World
        </p>

        <div className="flex gap-5 mt-8">
          <button className="bg-gradient-to-r from-[#FFD700] to-[#FF007F] text-black px-6 py-2 rounded-md font-semibold shadow-md hover:scale-105 transition">
            Start Your Project Now
          </button>

          <button className="border-2 border-[#FFD700] text-white px-6 py-2 rounded-md hover:bg-[#ff007f]/20 transition">
            Read More
          </button>
        </div>
      </div>

      <div className="mt-10 md:mt-0 w-full md:w-1/2 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-10 bg-gradient-to-r from-pink-500 via-purple-600 to-orange-400 opacity-40 blur-[120px] rounded-full"></div>

          <img
            src={heroImage}
            alt="Developer Illustration"
            className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
