import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function ProfilePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    address: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔑 Get userId from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // 📥 Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: res.data.user.name || "",
          age: res.data.user.age || "",
          email: res.data.user.email || "",
          address: res.data.user.address || "",
          role: res.data.user.role || "",
          password: "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile", err.response || err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Save changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/users/${userId}`,
        {
          name: form.name,
          age: form.age,
          address: form.address,
          password: form.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      setForm({
        ...form,
        name: res.data.user.name,
        age: res.data.user.age,
        address: res.data.user.address,
        role: res.data.user.role,
        email: res.data.user.email,
        password: "",
      });
    } catch (err) {
      alert("Error updating profile");
      console.error(err.response || err);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 flex flex-col">
      {/* Header at the top */}
      <Header onSearch={setSearchQuery} />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* 🌿 Left Sidebar */}
        <div className="w-64 bg-[#1B5E20] text-white flex flex-col p-6">
          <h2 className="text-2xl font-bold mb-10">🍄 Plantation</h2>
          <button
            onClick={() => navigate(`/${form.role}-dashboard`)}
            className="mb-4 px-4 py-2 bg-[#4CAF50] hover:bg-[#A5D6A7] hover:text-[#1B5E20] rounded-lg font-semibold transition"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="mt-auto px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* 📋 Profile Content */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">
              My Profile
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[#1B5E20] font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-[#1B5E20] font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#1B5E20] font-medium">Email</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[#1B5E20] font-medium">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#1B5E20] font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border rounded-lg bg-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[#1B5E20] font-medium">Role</label>
                <input
                  type="text"
                  value={form.role}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 text-right">
              <button
                onClick={handleSave}
                className="bg-[#4CAF50] hover:bg-[#1B5E20] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
