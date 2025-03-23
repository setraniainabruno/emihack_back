const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// 🔹 Récupérer tous les utilisateurs (sans afficher les mots de passe)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 🔹 Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 🔹 Créer un utilisateur (inscription)
exports.createUser = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      nom,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 🔹 Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { nom, email, role, verification, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { nom, email, role, verification },
      { new: true }
    );

    if (!updatedUser) {
      console.log("Utilisateur non trouvé");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log("Utilisateur mis à jour");
    res.json({ message: "Utilisateur mis à jour", user: updatedUser });
  } catch (error) {
    console.log("Erreur serveur", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updatePasswordUser = async (req, res) => {
  try {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10)
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { password: passwordHash },
      { new: true }
    );

    if (!updatedUser) {
      console.log("Utilisateur non trouvé");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log("Utilisateur mis à jour");
    res.json({ message: "Mot de passe mis à jour", user: updatedUser });
  } catch (error) {
    console.log("Erreur serveur", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 🔹 Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 🔹 Mettre à jour la dernière connexion
exports.updateLastLogin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { derniere_connexion: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Dernière connexion mise à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 🔹 Connexion (login)
exports.loginUser = async (req, res) => {
  try {
    // console.log(await bcrypt.hash("admin", 10));
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Email ou mot de passe incorrect");

      return res
        .status(404)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Email ou mot de passe incorrect");
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Données à inclure dans le token
      process.env.JWT_SECRET, // Clé secrète pour signer le token
      { expiresIn: "5h" } // Durée de validité du token
    );

    // Mettre à jour la dernière connexion
    user.derniere_connexion = Date.now();
    await user.save();

    // Réponse avec le token et les informations de l'utilisateur (sans le mot de passe)
    console.log("Connexion réussie");
    res.json({
      message: "Connexion réussie",
      token,
      user: {
        _id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        verification: user.verification,
        derniere_connexion: user.derniere_connexion,
        date_creation: user.date_creation,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
