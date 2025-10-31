export default function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-6 py-20">

      {/* Container for all diamonds */}
      <div className="relative flex flex-col items-center justify-center gap-20 w-full h-full">
        <h1 className="absolute top-12 right-6 md:top-20 md:right-24 text-3xl md:text-5xl font-[Zen_Dots] tracking-wider bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
          ABϴUT
        </h1>

        {/* Top Left Diamond */}
        <div className="absolute top-10 left-10 w-60 sm:w-66 h-60 sm:h-72 bg-gradient-to-b from-purple-500 to-pink-500 rotate-45 rounded-[3rem]" />

        {/* Center Diamond */}
        <div className="relative z-10 w-[20rem] sm:w-[35rem] h-[20rem] sm:h-[35rem] bg-gradient-to-b from-purple-400 to-pink-400 rotate-45 rounded-[4rem] flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.3)]">
          <p className="-rotate-45 text-white text-sm sm:text-sm md:text-xl font-light text-center px-4">
            DevSource is a development club under ACM USICT, GGSIPU, dedicated to fostering a community of passionate tech enthusiasts.
            We focus on Web Development, App Development, and Game Development, while also encouraging Open Source contributions.
            At DevSource, we aim to create a collaborative environment where students can learn, build, and grow together through real-world projects. 
            Our mission is to empower students to explore emerging technologies, develop impactful solutions, and become industry-ready innovators.
          </p>
        </div>

        {/* Bottom Right Diamond — shifted slightly so names are fully visible */}
        <div className="absolute bottom-10 right-10 w-60 sm:w-66 h-60 sm:h-72 bg-gradient-to-b from-green-300 to-pink-400 rotate-45 rounded-[3rem] shadow-lg flex items-center justify-center">
          <div className="-rotate-45 text-center text-black font-bold bg-white/40 backdrop-blur-md rounded-xl px-3 py-2 shadow-md">
            <p className="text-sm sm:text-base leading-tight">
              LEAD:&nbsp;
              <a
                href="https://www.linkedin.com/in/khushi-bhaskar-b00586324/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-500 underline underline-offset-2"
              >
                KHUSHI BHASKAR
              </a>
            </p>
            <p className="text-sm sm:text-base leading-tight">
              VICE LEAD:&nbsp;
              <a
                href="https://www.linkedin.com/in/krrish-khowal-150885311/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-500 underline underline-offset-2"
              >
                KRRISH KHØWAL
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
