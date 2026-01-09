import React, { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      if (onLogin) onLogin(res.data.user);
      alert(`Login successful as ${role}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🏥 Hospital Management Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Choose Role --</option>
              <option value="doctor">Doctor</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Email / Username
            </label>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} Hospital Management System
        </p>
      </div>
    </div>
  );
}
