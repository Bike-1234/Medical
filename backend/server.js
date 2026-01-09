const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/hr", require("./routes/hr"));
app.use("/api/employee", require("./routes/employee"));
app.use("/api/doctor", require("./routes/doctors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/medicines", require("./routes/medicines"));
app.use("/api/doctors", require("./routes/doctors"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
