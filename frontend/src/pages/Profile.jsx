import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../redux/features/authSlice";
import { 
  User, 
  Mail, 
  MapPin, 
  Lock, 
  Camera, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        address: user.shippingAddress?.address || "",
        city: user.shippingAddress?.city || "",
        state: user.shippingAddress?.state || "",
        zipCode: user.shippingAddress?.zipCode || "",
        country: user.shippingAddress?.country || "",
      });
      if (user.avatar?.url) {
        setAvatarPreview(user.avatar.url);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    if (formData.password) {
      submissionData.append("password", formData.password);
    }
    if (avatarFile) {
      submissionData.append("avatar", avatarFile);
    }

    const shippingAddress = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    };
    submissionData.append("shippingAddress", JSON.stringify(shippingAddress));

    try {
      const resultAction = await dispatch(updateUserProfile(submissionData));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully!");
        setFormData(prev => ({ ...prev, password: "" }));
      } else {
        toast.error(resultAction.payload || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An unexpected error occurred." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 px-8 py-10 text-white relative">
            <h1 className="text-3xl font-extrabold">Account Settings</h1>
            <p className="mt-1 text-purple-100 text-sm">Update your personal information and shipping details.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer shadow-md transition">
                  <Camera className="w-3.5 h-3.5" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="font-bold text-gray-800 text-lg">Profile Picture</h3>
                <p className="text-xs text-gray-500">Allowed formats: JPG, PNG, WEBP. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Personal Info */}
              <div className="space-y-5">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-600" />
                  Personal Information
                </h2>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-650">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-650 flex items-center gap-1">
                    Email Address <span className="text-[10px] text-gray-400 font-medium">(Read-only)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-650">
                    New Password <span className="text-[10px] text-gray-400 font-medium">(Leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Shipping Details */}
              <div className="space-y-5">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Shipping Address
                </h2>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-650">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-650">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-650">State / Province</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-650">Zip / Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-650">Country</label>
                    <input
                      type="text"
                      name="country"
                      placeholder="United States"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Action Button */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
