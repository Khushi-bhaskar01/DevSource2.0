import { FaLinkedin } from "react-icons/fa";

const MemberCard = ({ name, linkedin }) => {
  return (
    <div className="bg-black/30 rounded-xl py-3 px-4 mb-2 flex justify-between items-center text-sm text-white/90 border border-white/5">
      <span className="truncate">{name}</span>

      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500 transition"
        >
          <FaLinkedin size={16} />
        </a>
      )}
    </div>
  );
};

export default MemberCard;
