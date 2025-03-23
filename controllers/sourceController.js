// controllers/sourceController.js
const Source = require("../models/Source");
const XLSX = require("xlsx");
const fs = require("fs");

exports.uploadSource = async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("Chemin du fichier téléchargé:", filePath);

    // Lire le fichier Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // console.log("Données extraites du fichier Excel:", jsonData);

    // Insérer toutes les données en une seule fois
    const result = await Source.insertMany(jsonData);

    // Supprimer le fichier après traitement
    fs.unlinkSync(filePath);

    res
      .status(201)
      .send({ message: "Sources ajoutées avec succès", data: result });
  } catch (error) {
    console.error("Erreur lors de l'importation du fichier Excel :", error);
    res.status(400).send({ error: "Erreur lors de l'importation du fichier" });
  }
};

exports.getAllSources = async (req, res) => {
  try {
    const sources = await Source.find();
    res.send(sources);
  } catch (error) {
    res.status(500).send(error);
  }
};