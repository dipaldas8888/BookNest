import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setAuthFromToken, setUser } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import endpoints from "../api/endpoints";
import { User, Mail, Lock, Loader2, Eye, EyeOff, BookOpen, MailCheck, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        toast.info("Verification OTP sent! Please check your email.");
        setRegisteredEmail(formData.email);
        setShowOtp(true);
      } else if (registerUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload?.message || "Registration failed. Try again.");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError(""); setOtpSuccess("");
    try {
      const res = await API.post(endpoints.auth.verifyOtp, { email: registeredEmail, otp });
      setOtpSuccess("Account verified! Redirecting...");
      toast.success("Account verified successfully! Welcome to BookNest.");
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        dispatch(setAuthFromToken(res.data.token));
        dispatch(setUser(res.data.User));
      }
      setTimeout(() => navigate(res.data.User?.role === "admin" ? "/dashboard" : "/"), 1500);
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid or expired code.");
      toast.error(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await API.post(endpoints.auth.resendOtp, { email: registeredEmail });
      setOtpSuccess("A new code has been sent.");
      toast.info("A new OTP verification code has been sent to your email.");
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend.");
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  if (showOtp) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-[#1a3a2a]/10 text-[#1a3a2a] rounded-2xl flex items-center justify-center mx-auto">
              <MailCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Check Your Email</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              We've sent a 6-digit code to <span className="font-bold text-gray-800">{registeredEmail}</span>.<br />
              Enter it below to activate your account.
            </p>
          </div>

          {otpError && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{otpError}</div>}
          {otpSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">{otpSuccess}</div>}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text" required maxLength="6" inputMode="numeric"
              placeholder="· · · · · ·"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-2xl text-center font-black tracking-[0.6em] focus:outline-none focus:border-[#1a3a2a] transition"
            />
            <button
              type="submit" disabled={otpLoading || otp.length < 6}
              className="w-full flex items-center justify-center gap-2 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-40 cursor-pointer"
            >
              {otpLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify Account"}
            </button>
          </form>

          <div className="flex justify-between text-xs font-semibold">
            <button onClick={handleResendOtp} disabled={resendLoading} className="text-[#1a3a2a] hover:underline disabled:opacity-50">
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
            <button onClick={() => { setShowOtp(false); setOtp(""); }} className="text-gray-400 hover:text-gray-700">
              Back to Register
            </button>
          </div>
          <p className="text-center text-xs text-gray-400">Didn't receive it? Check your spam folder.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center p-4 py-16">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex">

        {/* Left Image Panel */}
        <div className="hidden lg:block relative w-5/12 bg-[#1a3a2a]">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
            alt="books"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="relative z-10 flex flex-col justify-between h-full p-10">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-white" />
              <span className="font-black text-white text-lg">BookNest</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white leading-snug mb-3">
                Join 10,000+ readers today.
              </h2>
              <p className="text-white/60 text-sm">
                Discover, collect, and enjoy great books every day.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["?w=32", "?w=33", "?w=34"].map((q, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#2d5a40]" />
                  ))}
                </div>
                <p className="text-white/70 text-xs font-semibold">+9,800 members this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Join BookNest — it's free!</p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => {
              const base = import.meta.env.VITE_API_URL || "https://booknest-il4o.onrender.com/";
              window.location.href = base.replace(/\/$/, "") + "/google";
            }}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition font-semibold text-gray-700 text-sm cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 40 40">
              <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 10 20 10C22.5492 10 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107"/>
              <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.5659 15.8008 10 20 10C22.5492 10 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04163 6.94833 5.25497 12.2425Z" fill="#FF3D00"/>
              <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3842L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50"/>
              <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3">
            <span className="flex-1 border-t border-gray-200" />
            <span className="text-[11px] text-gray-400 font-bold uppercase">or</span>
            <span className="flex-1 border-t border-gray-200" />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 focus:border-[#1a3a2a] transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 focus:border-[#1a3a2a] transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"} name="password" required
                  value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 focus:border-[#1a3a2a] transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={registerLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#1a3a2a] hover:bg-[#2d5a40] text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {registerLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#1a3a2a] hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
