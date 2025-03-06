const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    verification: { type: String, default: "false" },
    derniere_connexion: { type: Date, default: Date.now },
    date_creation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
