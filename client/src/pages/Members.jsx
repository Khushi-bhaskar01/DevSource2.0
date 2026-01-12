import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MemberCard from "../components/MemberCard";

const Members = () => {
  const [members, setMembers] = useState({
    webDev: [],
    gameDev: [],
    appDev: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/user/data", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.members) {
          setMembers({
            webDev: data.members.webDev || [],
            gameDev: data.members.gameDev || [],
            appDev: data.members.appDev || [],
          });
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-[Zen_Dots]">
        Loading members...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-[Zen_Dots] overflow-x-hidden">
      <Navbar />

      <h1 className="text-center text-5xl mt-24 tracking-wider font-bold bg-linear-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        MEMBERS
      </h1>

      <div className="flex justify-center items-start gap-12 mt-16 px-8 flex-wrap">
        {/* 🎮 Game Dev */}
        <div className="flex flex-col items-center">
          <div className="bg-linear-to-b from-yellow-200 to-cyan-200 w-64 h-[450px] rounded-2xl overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {members.gameDev.length > 0 ? (
              members.gameDev.map((m) => (
                <MemberCard
                  key={m._id}
                  name={m.name}
                  linkedin={m.linkedin}
                />
              ))
            ) : (
              <p className="text-black/60 text-sm text-center">
                No members yet
              </p>
            )}
          </div>
          <p className="mt-4 text-lg text-yellow-100">🎮 Game Dev</p>
        </div>

        {/* 💻 Web Dev */}
        <div className="flex flex-col items-center">
          <div className="bg-linear-to-b from-blue-200 to-pink-300 w-72 h-[550px] rounded-2xl overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {members.webDev.length > 0 ? (
              members.webDev.map((m) => (
                <MemberCard
                  key={m._id}
                  name={m.name}
                  linkedin={m.linkedin}
                />
              ))
            ) : (
              <p className="text-black/60 text-sm text-center">
                No members yet
              </p>
            )}
          </div>
          <p className="mt-4 text-lg text-pink-200">💻 Web Dev</p>
        </div>

        {/* 📱 App Dev */}
        <div className="flex flex-col items-center">
          <div className="bg-linear-to-b from-green-200 to-cyan-200 w-64 h-[450px] rounded-2xl overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {members.appDev.length > 0 ? (
              members.appDev.map((m) => (
                <MemberCard
                  key={m._id}
                  name={m.name}
                  linkedin={m.linkedin}
                />
              ))
            ) : (
              <p className="text-black/60 text-sm text-center">
                No members yet
              </p>
            )}
          </div>
          <p className="mt-4 text-lg text-green-200">📱 App Dev</p>
        </div>
      </div>
    </div>
  );
};

export default Members;
