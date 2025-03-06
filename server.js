// app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require('dotenv').config();
const sourceRoutes = require("./routes/sourceRoutes");
const userRoutes = require('./routes/userRoutes');
const app = express();


// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
 
connectDB();

// Routes
app.use("/api/sources", sourceRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});