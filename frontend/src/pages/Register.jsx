import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setAuthFromToken, setUser } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import endpoints from "../api/endpoints";
import { ShieldCheck, Mail, User, Lock, Loader2, MailCheck } from "lucide-react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setOtpError("");

    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        setRegisteredEmail(formData.email);
        setShowOtp(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const res = await API.post(endpoints.auth.verifyOtp, {
        email: registeredEmail,
        otp,
      });

      setOtpSuccess("Account verified! Redirecting...");
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        dispatch(setAuthFromToken(res.data.token));
        dispatch(setUser(res.data.User));
      }

      setTimeout(() => {
        const user = res.data.User;
        navigate(user?.role === "admin" ? "/dashboard" : "/");
      }, 1500);
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError("");
    setOtpSuccess("");
    try {
      await API.post(endpoints.auth.resendOtp, { email: registeredEmail });
      setOtpSuccess("A new code has been sent to your email.");
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  if (showOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <MailCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Check Your Email</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold text-gray-800">{registeredEmail}</span>.
              <br />Enter it below to activate your account.
            </p>
          </div>

          {otpError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {otpError}
            </div>
          )}
          {otpSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              {otpSuccess}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
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

            <button
              type="submit"
              disabled={otpLoading || otp.length < 6}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-40 cursor-pointer shadow"
            >
              {otpLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs font-semibold pt-1">
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-purple-600 hover:text-purple-800 transition disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
            <button
              onClick={() => { setShowOtp(false); setOtp(""); }}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              Back to Register
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            Didn't receive an email? Check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="flex bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div className="hidden lg:block lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&w=667&q=80"
            alt="books"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full p-8 lg:w-1/2 flex flex-col justify-center space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">BookNest</h1>
            <p className="text-sm text-gray-500">Create an account to get started!</p>
          </div>

          <button
            type="button"
            onClick={() => { window.location.href = "http://localhost:5000/google"; }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition font-semibold text-gray-700 text-sm"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 40 40">
              <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3">
            <span className="border-b flex-1 border-gray-200"></span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">or use email</span>
            <span className="border-b flex-1 border-gray-200"></span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  required placeholder="Your Name"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  required placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  required placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-40 cursor-pointer shadow"
            >
              {registerLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-purple-600 hover:text-purple-800 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
