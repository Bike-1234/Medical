import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

const styles = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" },
  sidebar: {
    width: "220px",
    background: "#28a745",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  sidebarItem: (active) => ({
    padding: "15px 20px",
    cursor: "pointer",
    background: active ? "#1e7e34" : "transparent",
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
  button: { padding: "10px 15px", borderRadius: "5px", cursor: "pointer", background: "#28a745", color: "#fff", border: "none" },
  logoutBtn: { padding: "8px 12px", marginTop: "20px", borderRadius: "5px", cursor: "pointer", background: "#dc3545", color: "#fff", border: "none" },
};

export default function DoctorDashboard({ user, logout }) {
  const [selected, setSelected] = useState("profile"); // profile / appointments / medicines / upload-medicine
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [profile, setProfile] = useState(user);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchAppointments();
    fetchMedicines();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/doctor/appointments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${API}/doctor/medicines`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMedicines(res.data);
    } catch (err) { console.error(err); }
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put(`${API}/users/${profile.id}`, profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(res.data);
      setEditingProfile(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const uploadMedicine = async () => {
    if (!newMedicine.name || !newMedicine.description) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(`${API}/medicines`, newMedicine, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMedicines([...medicines, res.data]);
      setNewMedicine({ name: "", description: "" });
      alert("Medicine uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload medicine");
    }
  };

  const verifyAppointment = async (id) => {
    try {
      const res = await axios.put(`${API}/appointments/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
        <h2 style={{ textAlign: "center" }}>Doctor</h2>
        <div style={styles.sidebarItem(selected === "profile")} onClick={() => setSelected("profile")}>Profile</div>
        <div style={styles.sidebarItem(selected === "appointments")} onClick={() => setSelected("appointments")}>My Appointments</div>
        <div style={styles.sidebarItem(selected === "medicines")} onClick={() => setSelected("medicines")}>Employees Medicines</div>
        <div style={styles.sidebarItem(selected === "upload-medicine")} onClick={() => setSelected("upload-medicine")}>Upload Medicine</div>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* Content Area */}
      <div style={styles.content}>
        {selected === "profile" && (
          <div>
            <h3>My Profile</h3>
            {editingProfile ? (
              <div>
                <input
                  style={styles.input}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  style={styles.input}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Email"
                />
                <button style={styles.button} onClick={saveProfile}>Save</button>
                <button style={{...styles.button, background:"#6c757d", marginLeft:"10px"}} onClick={()=>setEditingProfile(false)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <button style={styles.button} onClick={()=>setEditingProfile(true)}>Edit Profile</button>
              </div>
            )}
          </div>
        )}

        {selected === "appointments" && (
          <div>
            <h3>My Appointments</h3>
            {appointments.length === 0 ? <p>No appointments</p> :
              appointments.map(a => (
                <div key={a._id} style={styles.card}>
                  <p><strong>Employee:</strong> {a.employeeId?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {a.employeeId?.email || "N/A"}</p>
                  <p><strong>Doctor:</strong> {a.doctorId?.name || "N/A"}</p>
                  <p><strong>Date:</strong> {a.date} at {a.time}</p>
                  <p><strong>Status:</strong> {a.status}</p>
                  <p><strong>Verified:</strong> {a.verified ? "Yes" : "No"}</p>
                  {!a.verified && (
                    <button
                      style={styles.button}
                      onClick={() => verifyAppointment(a._id)}
                    >
                      Verify
                    </button>
                  )}
                </div>
              ))
            }
          </div>
        )}

        {selected === "medicines" && (
          <div>
            <h3>All Employees Medicines</h3>
            {medicines.length === 0 ? <p>No medicines</p> :
              medicines.map(m => (
                <div key={m._id} style={styles.card}>
                  <p><strong>Medicine:</strong> {m.name}</p>
                  <p><strong>Description:</strong> {m.description}</p>
                  <p><strong>Quantity:</strong> {m.quantity || "N/A"}</p>
                  <p><strong>Uploaded By:</strong> {m.uploadedBy?.name || "Unknown"}</p>
                </div>
              ))
            }
          </div>
        )}

        {selected === "upload-medicine" && (
          <div>
            <h3>Upload New Medicine</h3>
            <div style={styles.card}>
              <input
                style={styles.input}
                type="text"
                placeholder="Medicine Name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
              />
              <textarea
                style={{ ...styles.input, height: "80px" }}
                placeholder="Description"
                value={newMedicine.description}
                onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
              />
              <button style={styles.button} onClick={uploadMedicine}>Upload Medicine</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
