import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import endpoints from "../api/endpoints";
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle2, MailCheck } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post(endpoints.auth.forgotPassword, { email });
      setSuccess("Verification code sent! Check your email inbox.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "No account found with that email address.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post(endpoints.auth.resetPassword, { email, otp, newPassword });
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    try {
      await API.post(endpoints.auth.forgotPassword, { email });
      setSuccess("A new code has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-8 space-y-6">

        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            {step === 1 ? <KeyRound className="w-7 h-7" /> : <MailCheck className="w-7 h-7" />}
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {step === 1 ? "Forgot Password?" : "Check Your Email"}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {step === 1
              ? "Enter your registered email and we'll send you a reset code."
              : <>A 6-digit reset code was sent to <span className="font-semibold text-gray-800">{email}</span>.<br />Enter it below to set a new password.</>
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-40 cursor-pointer shadow"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending Code...</>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength="6"
                inputMode="numeric"
                placeholder="· · · · · ·"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl text-center font-bold tracking-[0.5em] focus:outline-none focus:border-purple-500 bg-gray-50 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                New Password
              </label>
              <input
                type="password"
                required
                minLength="6"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-40 cursor-pointer shadow"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="flex items-center justify-between text-xs font-semibold">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-purple-600 hover:text-purple-800 transition"
              >
                Resend Code
              </button>
              <p className="text-gray-400">Check spam if not received</p>
            </div>
          </form>
        )}

        <div className="pt-1 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
