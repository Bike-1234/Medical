// src/Auth.js
import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // ✅ Login API
        const res = await axios.post(`${API}/auth/login`, {
          email: form.email,
          password: form.password,
          role: form.role,
        });
        localStorage.setItem("token", res.data.token);
        onLogin(res.data.user);
      } else {
        // ✅ Register API
        await axios.post(`${API}/auth/register`, form);
        alert("Registration successful!");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login/Register failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="doctor">Doctor</option>
            <option value="hr">HR</option>
          </select>

          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? "New user? Register here" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
