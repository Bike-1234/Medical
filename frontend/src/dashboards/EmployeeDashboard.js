// src/dashboards/EmployeeDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

const styles = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" },
  sidebar: {
    width: "220px",
    background: "#007bff",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  sidebarItem: (active) => ({
    padding: "15px 20px",
    cursor: "pointer",
    background: active ? "#0056b3" : "transparent",
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
  input: { padding: "10px", width: "70%", marginBottom: "10px", borderRadius: "5px" },
  select: { padding: "10px", width: "74%", marginBottom: "10px", borderRadius: "5px" },
  button: { padding: "10px 15px", borderRadius: "5px", cursor: "pointer", background: "#007bff", color: "#fff", border: "none" },
  logoutBtn: { padding: "8px 12px", marginTop: "20px", borderRadius: "5px", cursor: "pointer", background: "#dc3545", color: "#fff", border: "none" },
};

export default function EmployeeDashboard({ user, onLogout }) {
  const [selected, setSelected] = useState("attendance");
  const [attendance, setAttendance] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    name: user.name || "",
    email: user.email || "",
    doctorId: "",
    datetime: "",
  });

  const [attendanceStatus, setAttendanceStatus] = useState("present");

  useEffect(() => {
    fetchAttendance();
    fetchAppointments();
    fetchMedicines();
    fetchDoctors();
  }, []);

  // Fetch employee attendance
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API}/employee/attendance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark attendance (Present/Absent)
  const markAttendance = async () => {
    try {
      const res = await axios.post(
        `${API}/employee/attendance`,
        { status: attendanceStatus }, // send selected status
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAttendance([res.data, ...attendance]);
      alert("Attendance marked successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance");
    }
  };

  // Fetch employee appointments (doctor populated)
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/employee/appointments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${API}/medicines`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle input change
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  // Book new appointment
  const bookAppointment = async () => {
    if (!newAppointment.name || !newAppointment.email || !newAppointment.doctorId || !newAppointment.datetime) {
      return alert("Please fill all fields including doctor and date/time");
    }
    try {
      const res = await axios.post(
        `${API}/employee/appointments`,
        newAppointment,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAppointments([...appointments, res.data]);
      setNewAppointment((prev) => ({ ...prev, doctorId: "", datetime: "" }));
      alert("Appointment booked successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment");
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ textAlign: "center" }}>Employee</h2>
        <div style={styles.sidebarItem(selected === "attendance")} onClick={() => setSelected("attendance")}>Attendance</div>
        <div style={styles.sidebarItem(selected === "appointments")} onClick={() => setSelected("appointments")}>Appointments</div>
        <div style={styles.sidebarItem(selected === "medicines")} onClick={() => setSelected("medicines")}>Medicines</div>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Attendance Tab */}
        {selected === "attendance" && (
          <>
            <h3>Attendance</h3>

            {/* Mark Attendance Section */}
            <div style={styles.card}>
              <h4>Mark Attendance</h4>
              <select
                style={styles.select}
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <button style={styles.button} onClick={markAttendance}>Submit</button>
            </div>

            {/* Attendance Records */}
            {attendance.length === 0 ? (
              <p>No attendance records</p>
            ) : (
              attendance.map((a) => (
                <div key={a._id} style={styles.card}>
                  Date: {a.date} | Status: <strong>{a.status.toUpperCase()}</strong>
                </div>
              ))
            )}
          </>
        )}

        {/* Appointments Tab */}
        {selected === "appointments" && (
          <>
            <h3>Appointments</h3>
            {appointments.length === 0 ? <p>No appointments</p> :
              appointments.map(a => (
                <div key={a._id} style={styles.card}>
                  <p><strong>Name:</strong> {a.patientName}</p>
                  <p><strong>Email:</strong> {a.patientEmail}</p>
                  <p><strong>Doctor:</strong> {a.doctorId?.name || "N/A"}</p>
                  <p><strong>Date:</strong> {a.date} at {a.time}</p>
                  <p><strong>Status:</strong> {a.status}</p>
                </div>
              ))
            }

            {/* Book Appointment */}
            <div style={{ marginTop: "20px" }}>
              <input
                style={styles.input}
                type="text"
                name="name"
                value={newAppointment.name}
                onChange={handleAppointmentChange}
                placeholder="Enter your name"
              />
              <input
                style={styles.input}
                type="email"
                name="email"
                value={newAppointment.email}
                onChange={handleAppointmentChange}
                placeholder="Enter your email"
              />
              <select
                style={styles.input}
                name="doctorId"
                value={newAppointment.doctorId}
                onChange={handleAppointmentChange}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} ({d.specialization || "General"})</option>
                ))}
              </select>
              <input
                style={styles.input}
                type="datetime-local"
                name="datetime"
                value={newAppointment.datetime}
                onChange={handleAppointmentChange}
              />
              <button style={styles.button} onClick={bookAppointment}>Book Appointment</button>
            </div>
          </>
        )}

        {/* Medicines Tab */}
        {selected === "medicines" && (
          <>
            <h3>Medicines</h3>
            {medicines.length === 0 ? <p>No medicines</p> :
              medicines.map((m) => (
                <div key={m._id} style={styles.card}>
                  <p><strong>Medicine:</strong> {m.name}</p>
                  <p><strong>Description:</strong> {m.description}</p>
                  <p><strong>Quantity:</strong> {m.quantity || "N/A"}</p>
                  <p><strong>Uploaded By:</strong> {m.uploadedBy?.name || "Unknown"}</p>
                </div>
              ))
            }
          </>
        )}
      </div>
    </div>
  );
}
