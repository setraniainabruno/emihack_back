const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  derniereMiseAJour: { type: Date, default: Date.now },
  frequence: { type: String, required: true },
  statut: { type: String, enum: ["Actif", "Inactif"], default: "Actif" },
  data: [{ type: mongoose.Schema.Types.Mixed }],
});

const Source = mongoose.model("Source", sourceSchema);

module.exports = Source;