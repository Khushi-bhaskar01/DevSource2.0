import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Filter,
  User,
  ClipboardList,
} from "lucide-react";

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, submissionId: null, action: null });
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!authUser?._id || authUser.role !== "admin") {
      navigate("/");
      return;
    }

    fetchSubmissions();
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    let filtered = submissions;

    if (filterStatus !== "all") {
      // Match backend status (Pending, Approved, Rejected with capital first letter)
      const statusMap = {
        pending: "Pending",
        approved: "Approved", 
        rejected: "Rejected"
      };
      filtered = filtered.filter((s) => s.status === statusMap[filterStatus]);
    }

    setFilteredSubmissions(filtered);
  }, [filterStatus, submissions]);

  const fetchSubmissions = async () => {
    try {
      setError("");
      const res = await api.get("/api/submissions");
      const submissionsData = Array.isArray(res.data)
        ? res.data
        : res.data?.submissions || [];

      // Sort by status priority: Pending first, then by date
      const sorted = submissionsData.sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setSubmissions(sorted);
      setFilteredSubmissions(sorted);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setError(err.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId, newStatus) => {
    setProcessingId(submissionId);
    setError("");

    try {
      // Send status with capital first letter to match backend enum
      const payload = { 
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) 
      };
      
      // Add feedback if provided
      if (feedbackText.trim()) {
        payload.feedback = feedbackText.trim();
      }
      
      await api.put(`/api/submissions/${submissionId}`, payload);
      
      // Reset feedback and close modal
      setFeedbackText("");
      setFeedbackModal({ open: false, submissionId: null, action: null });
      
      // Refresh submissions list
      await fetchSubmissions();
    } catch (err) {
      console.error("Failed to update submission:", err);
      setError(err.response?.data?.message || "Failed to update submission");
    } finally {
      setProcessingId(null);
    }
  };

  const openFeedbackModal = (submissionId, action) => {
    setFeedbackModal({ open: true, submissionId, action });
    setFeedbackText("");
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, submissionId: null, action: null });
    setFeedbackText("");
  };

  const getStatusBadge = (status) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-[Zen_Dots] text-yellow-400 flex items-center gap-1 w-fit">
            <Clock size={12} /> Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs font-[Zen_Dots] text-green-400 flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-xs font-[Zen_Dots] text-red-400 flex items-center gap-1 w-fit">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/50 rounded-full text-xs font-[Zen_Dots] text-gray-400 w-fit">
            {status}
          </span>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <p className="text-center animate-pulse font-[Zen_Dots] mt-10">
          Loading submissions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-[Zen_Dots]">Review Submissions</h1>
            <p className="text-white/60 mt-1 text-sm">
              Total: {filteredSubmissions.length} submissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-white/60" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 px-4 py-3 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* SUBMISSIONS LIST */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <p className="text-white/60 font-[Zen_Dots]">
                No submissions found
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* LEFT: INFO */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-[Zen_Dots] text-lg">
                          {submission.taskId?.title || "Task Deleted"}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                          {submission.taskId?.description || "No description"}
                        </p>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <User size={16} className="shrink-0" />
                        <span>
                          {submission.userId?.name || "Unknown User"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClipboardList size={16} className="shrink-0" />
                        <span className="uppercase">
                          {submission.taskId?.domain || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 font-bold">
                        {submission.taskId?.points || 0} pts
                      </div>
                      <div className="text-white/50 text-xs">
                        Submitted:{" "}
                        {new Date(submission.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <a
                        href={submission.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm break-all"
                      >
                        <ExternalLink size={16} className="shrink-0" />
                        View Submission Link
                      </a>
                    </div>

                    {submission.feedback && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 mt-2">
                        <p className="text-xs text-white/60 mb-1">Feedback:</p>
                        <p className="text-sm">{submission.feedback}</p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: ACTIONS */}
                  {submission.status?.toLowerCase() === "pending" && (
                    <div className="flex lg:flex-col gap-3">
                      <button
                        onClick={() => openFeedbackModal(submission._id, "approved")}
                        disabled={processingId === submission._id}
                        className="flex-1 lg:flex-none bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-[Zen_Dots] flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => openFeedbackModal(submission._id, "rejected")}
                        disabled={processingId === submission._id}
                        className="flex-1 lg:flex-none bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-[Zen_Dots] flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-white/20 rounded-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="text-xl font-[Zen_Dots]">
              {feedbackModal.action === "approved" ? "Approve" : "Reject"} Submission
            </h2>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Provide feedback to the user..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={closeFeedbackModal}
                className="flex-1 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-lg font-[Zen_Dots] transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(feedbackModal.submissionId, feedbackModal.action)}
                disabled={processingId === feedbackModal.submissionId}
                className={`flex-1 px-6 py-3 rounded-lg font-[Zen_Dots] transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  feedbackModal.action === "approved"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {processingId === feedbackModal.submissionId ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}