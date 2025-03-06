const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connecté à la base de données MongoDB");
  } catch (err) {
    console.error("Erreur de connexion à MongoDB :", err);
    process.exit(1);
  }
};

module.exports = connectDB;