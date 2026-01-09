import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

const styles = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" },
  sidebar: {
    width: "220px",
    background: "#6f42c1",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  sidebarItem: (active) => ({
    padding: "15px 20px",
    cursor: "pointer",
    background: active ? "#593196" : "transparent",
    margin: "5px 0",
    borderRadius: "5px",
  }),
  content: { flex: 1, padding: "20px", background: "#f0f2f5", overflowY: "auto" },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  total: { fontSize: "18px", fontWeight: "bold", marginBottom: "15px" },
  button: { padding: "6px 12px", borderRadius: "5px", cursor: "pointer", margin: "5px", border: "none" },
  logoutBtn: { padding: "8px 12px", marginTop: "20px", borderRadius: "5px", cursor: "pointer", background: "#dc3545", color: "#fff", border: "none" },
  submitBtn: { background: "#007bff", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" },
};

export default function HRDashboard({ user, onLogout }) {
  const [selected, setSelected] = useState("profile");
  const [employees, setEmployees] = useState([]);
  const [employeesError, setEmployeesError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
    fetchDoctors();
    fetchAttendance();
    fetchAppointments();
    fetchMedicines();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/hr/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data || []);
      setEmployeesError(null);
    } catch (err) {
      console.error("Employees fetch failed", err);
      setEmployeesError("Failed to load employees. Please check your connection or try again.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API}/hr/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Doctors fetch failed", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API}/hr/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data || []);
    } catch (err) {
      console.error("Attendance fetch failed", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/hr/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Appointments fetch failed", err);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${API}/hr/medicines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data || []);
    } catch (err) {
      console.error("Medicines fetch failed", err);
    }
  };

  const markAttendance = (employeeId, status) => {
    setAttendanceForm((prev) => ({ ...prev, [employeeId]: status }));
  };

  const submitAttendance = async () => {
    const data = Object.entries(attendanceForm).map(([employeeId, status]) => ({ employeeId, status }));
    if (data.length === 0) return alert("⚠️ Please mark attendance for at least one employee.");

    try {
      await axios.post(`${API}/hr/attendance`, { attendance: data }, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ Attendance submitted!");
      setAttendanceForm({});
      fetchAttendance();
    } catch (err) {
      console.error("Submit attendance failed", err);
      alert("Failed to submit attendance. Please try again.");
    }
  };

  const verifyAppointment = async (id) => {
    try {
      const res = await axios.put(`${API}/appointments/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(a => a._id === id ? res.data : a));
      alert("Appointment verified!");
    } catch (err) {
      console.error(err);
      alert("Failed to verify appointment");
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ textAlign: "center" }}>HR Panel</h2>
        <div style={styles.sidebarItem(selected === "profile")} onClick={() => setSelected("profile")}>Profile</div>
        <div style={styles.sidebarItem(selected === "employees")} onClick={() => setSelected("employees")}>Employees</div>
        <div style={styles.sidebarItem(selected === "doctors")} onClick={() => setSelected("doctors")}>Doctors</div>
        <div style={styles.sidebarItem(selected === "attendance")} onClick={() => setSelected("attendance")}>Attendance</div>
        <div style={styles.sidebarItem(selected === "appointments")} onClick={() => setSelected("appointments")}>Appointments</div>
        <div style={styles.sidebarItem(selected === "medicines")} onClick={() => setSelected("medicines")}>Medicines</div>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>

      {/* Content Area */}
      <div style={styles.content}>
        {selected === "profile" && (
          <div style={styles.card}>
            <h3>👤 Profile</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        )}

        {selected === "employees" && (
          <div>
            <h3>👨‍💼 Employees</h3>
            <div style={styles.total}>Total Employees: {employees.length}</div>
            {employeesError && <p style={{ color: "red" }}>{employeesError}</p>}
            {employees.length === 0 && !employeesError && <p>No employees found. Please register some employees.</p>}
            {employees.map((emp) => (
              <div key={emp._id} style={styles.card}>
                <p><strong>{emp.name}</strong></p>
                <p>Email: {emp.email}</p>
                <p>Role: {emp.role}</p>
              </div>
            ))}
          </div>
        )}

        {selected === "doctors" && (
          <div>
            <h3>👩‍⚕️ Doctors</h3>
            <div style={styles.total}>Total Doctors: {doctors.length}</div>
            {doctors.map((doc) => (
              <div key={doc._id} style={styles.card}>
                <p><strong>{doc.name}</strong></p>
                <p>Specialization: {doc.specialization}</p>
                <p>Email: {doc.email}</p>
              </div>
            ))}
          </div>
        )}

        {selected === "attendance" && (
          <div>
            <h3>📅 Mark Attendance</h3>
            <div style={styles.total}>Total Employees: {employees.length}</div>
            {employees.map((emp) => (
              <div key={emp._id} style={styles.card}>
                <p><strong>{emp.name}</strong> ({emp.email})</p>
                <button
                  style={{
                    ...styles.button,
                    background: attendanceForm[emp._id] === "present" ? "#28a745" : "#e0e0e0",
                    color: attendanceForm[emp._id] === "present" ? "#fff" : "#000",
                  }}
                  onClick={() => markAttendance(emp._id, "present")}
                >
                  ✅ Present
                </button>
                <button
                  style={{
                    ...styles.button,
                    background: attendanceForm[emp._id] === "absent" ? "#dc3545" : "#e0e0e0",
                    color: attendanceForm[emp._id] === "absent" ? "#fff" : "#000",
                  }}
                  onClick={() => markAttendance(emp._id, "absent")}
                >
                  ❌ Absent
                </button>
              </div>
            ))}
            <button style={styles.submitBtn} onClick={submitAttendance}>Submit Attendance</button>

            <hr style={{ margin: "20px 0" }} />
            <h3>📋 Previous Attendance Records</h3>
            {attendance.length === 0 ? (
              <p>No attendance records yet.</p>
            ) : (
              attendance.map((a) => (
                <div key={a._id} style={styles.card}>
                  <p><strong>Date:</strong> {a.date}</p>
                  <p><strong>Employee:</strong> {a.employeeId?.name || "Unknown"}</p>
                  <p><strong>Status:</strong> {a.status}</p>
                </div>
              ))
            )}
          </div>
        )}

        {selected === "appointments" && (
          <div>
            <h3>📅 Appointments</h3>
            {appointments.length === 0 ? (
              <p>No appointments available.</p>
            ) : (
              appointments.map((app) => (
                <div key={app._id} style={styles.card}>
                  <p><strong>Patient:</strong> {app.patientName}</p>
                  <p><strong>Doctor:</strong> {app.doctorId?.name || "N/A"}</p>
                  <p><strong>Date:</strong> {app.date} at {app.time}</p>
                  <p><strong>Status:</strong> {app.status}</p>
                  <p><strong>Employee:</strong> {app.employeeId?.name || "N/A"}</p>
                  <p><strong>Verified:</strong> {app.verified ? "Yes" : "No"}</p>
                  {!app.verified && (
                    <button
                      style={styles.button}
                      onClick={() => verifyAppointment(app._id)}
                    >
                      Verify
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {selected === "medicines" && (
          <div>
            <h3>💊 Medicines</h3>
            {medicines.length === 0 ? (
              <p>No medicines found.</p>
            ) : (
              medicines.map((m) => (
                <div key={m._id} style={styles.card}>
                  <p><strong>{m.name}</strong></p>
                  <p>Description: {m.description}</p>
                  <p>Uploaded By: {m.uploadedBy?.name || "Unknown"}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
