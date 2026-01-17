import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import api from "../api/axiosInstance";
import { Trophy, Medal, Award, TrendingUp, User } from "lucide-react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headerRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/api/leaderboard");
        setLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError(err.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (!loading && leaderboard.length > 0) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      if (tableRef.current) {
        gsap.fromTo(
          tableRef.current.children,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.3,
          }
        );
      }
    }
  }, [loading, leaderboard]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} className="text-yellow-400" />;
      case 2:
        return <Medal size={24} className="text-gray-300" />;
      case 3:
        return <Award size={24} className="text-amber-600" />;
      default:
        return <span className="text-lg font-bold font-mono text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/40 text-yellow-400";
      case 2:
        return "bg-gray-400/10 border-gray-400/40 text-gray-300";
      case 3:
        return "bg-amber-600/10 border-amber-600/40 text-amber-500";
      default:
        return "bg-zinc-800 border-zinc-700 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-700 rounded-lg">
            <svg className="animate-spin h-5 w-5 text-purple-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="font-mono text-sm text-gray-300">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-8 relative overflow-hidden">
      <Navbar />

      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20"></div>
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto mt-10 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-600/10 border-2 border-purple-500/30 rounded-xl">
              <TrendingUp size={32} className="text-purple-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-mono">/ leaderboard</h1>
              <p className="text-gray-500 font-mono text-sm mt-1">Top {leaderboard.length} contributors</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/40 px-5 py-4 rounded-xl mb-8">
            <p className="text-red-400 font-mono text-sm">{error}</p>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block bg-zinc-900 border-2 border-zinc-700 px-8 py-6 rounded-xl">
              <p className="text-gray-400 font-mono">No data available yet</p>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-800 border-b-2 border-zinc-700 text-sm font-mono text-gray-400 uppercase tracking-wide">
              <div className="col-span-1">Rank</div>
              <div className="col-span-6 md:col-span-5">Player</div>
              <div className="col-span-3 md:col-span-4 text-center">Details</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {/* Table Body */}
            <div ref={tableRef} className="divide-y-2 divide-zinc-800">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                const isTopThree = rank <= 3;

                return (
                  <div
                    key={player._id}
                    className={`grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all duration-300 hover:bg-zinc-800/50 ${
                      isTopThree ? "bg-zinc-800/30" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${getRankBadgeColor(rank)}`}>
                        {getRankIcon(rank)}
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center border-2 border-zinc-700 overflow-hidden shrink-0">
                        {player.profilePicture ? (
                          <img 
                            src={player.profilePicture} 
                            alt={player.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>

                      {/* Name */}
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">
                          {player.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          ID: {player._id.slice(-6)}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="col-span-3 md:col-span-4 flex flex-col md:flex-row gap-2 justify-center items-center">
                      {player.branch && (
                        <span className="px-2.5 py-1 bg-purple-600/10 text-purple-300 border border-purple-500/30 rounded text-xs font-mono">
                          {player.branch}
                        </span>
                      )}
                      {player.year && (
                        <span className="px-2.5 py-1 bg-zinc-800 text-gray-400 border border-zinc-700 rounded text-xs font-mono">
                          {player.year}
                        </span>
                      )}
                    </div>

                    {/* Points */}
                    <div className="col-span-2 text-right">
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                        <span className="text-lg font-bold font-mono text-yellow-400">
                          {player.points.toLocaleString()}
                        </span>
                        <span className="text-xs text-yellow-500/60 font-mono">pts</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {leaderboard.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-5 text-center">
              <Trophy size={24} className="text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-yellow-400">
                {leaderboard[0]?.points.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">Top Score</p>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-5 text-center">
              <TrendingUp size={24} className="text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-purple-400">
                {Math.round(
                  leaderboard.reduce((sum, p) => sum + p.points, 0) / leaderboard.length
                ).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">Average Points</p>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-5 text-center">
              <User size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-white">
                {leaderboard.length}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">Total Players</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}