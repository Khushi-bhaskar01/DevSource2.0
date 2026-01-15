import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const teamMembers = [
  {
    name: "Khushi Bhaskar",
    image: "/images/KB.jpg",
    github: "https://github.com/Khushi-bhaskar01",
    linkedin: "https://www.linkedin.com/in/khushi-bhaskar-b00586324/",
  },
  {
    name: "Krrish Khowal",
    // image: "/images/krrish.jpg",
    github: "https://github.com/krrishdev",
    linkedin: "https://linkedin.com/in/krrish",
  },
  {
    name: "Utkarsh Yadav",
    image: "/images/utk.jpg",
    github: "https://github.com/utkarsh3078",
    linkedin: "https://www.linkedin.com/in/utkarsh-yadav3078a",
  }, {
    name: "Anurag kr Singh",
    // image: "/images/krrish.jpg",
    github: "https://github.com/krrishdev",
    linkedin: "https://linkedin.com/in/krrish",
  },
  {
    name: "Aadi Jain",
    // image: "/images/krrish.jpg",
    github: "https://github.com/krrishdev",
    linkedin: "https://linkedin.com/in/krrish",
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="py-16 bg-black text-center text-white">
      <h2 className="text-4xl md:text-3xl font-[Zen_Dots] font-semibold mb-12 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        MEET OUR TEAM
      </h2>

      <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="relative w-48 h-48 rounded-full bg-linear-to-br from-purple-400 via-pink-400 to-green-300 p-[3px] hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <h3 className="text-lg font-medium">{member.name}</h3>
              <div className="flex gap-4 mt-2">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
