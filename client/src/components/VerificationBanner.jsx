import React, { useEffect, useState } from "react";
import { AlertCircle, X, Shield } from "lucide-react";
import api from "../api/axiosInstance";
import EmailVerification from "./EmailVerification";

export default function VerificationBanner({ onVerificationSuccess }) {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const res = await api.get("/api/auth/is-auth");
        setIsVerified(res.data.user.isAccountVerified);
      } catch (err) {
        console.error("Failed to check verification", err);
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, []);

  const handleSuccess = () => {
    setShowModal(false);
    setIsVerified(true);
    if (onVerificationSuccess) onVerificationSuccess();
  };

  if (loading || isVerified || dismissed) return null;

  return (
    <>
      <div className="bg-yellow-500/10 border-b-2 border-yellow-500/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-yellow-400 shrink-0" />
            <p className="text-yellow-400 font-mono text-sm">
              <span className="font-bold">Email not verified.</span>{" "}
              Verify your email to unlock all features.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg text-sm transition-colors font-mono flex items-center gap-2"
            >
              <Shield size={14} />
              Verify Now
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-yellow-400 hover:text-yellow-300"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <EmailVerification
          onVerificationSuccess={handleSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
