import React, { useState } from "react";
import Auth from "./Auth";
import EmployeeDashboard from "./dashboards/EmployeeDashboard";
import DoctorDashboard from "./dashboards/DoctorDashboard";
import HRDashboard from "./dashboards/HRDashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  switch (user.role) {
    case "employee":
      return <EmployeeDashboard user={user} onLogout={handleLogout} />;
    case "doctor":
      return <DoctorDashboard user={user} logout={handleLogout} />;
    case "hr":
      return <HRDashboard user={user} onLogout={handleLogout} />;
    default:
      return <div>Unknown role</div>;
  }
}

export default App;
