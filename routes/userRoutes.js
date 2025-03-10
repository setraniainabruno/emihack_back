const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updatePasswordUser,
  deleteUser,
  updateLastLogin,
  loginUser,
} = require("../controllers/userController");
const authMiddleware = require("../utils/tokenMiddleware");

// Routes utilisateurs
router.get("/", authMiddleware.verifyToken, getAllUsers);
router.get("/:id", getUserById);
router.post("/ajouter", createUser);
router.put("/update/:id", authMiddleware.verifyToken, updateUser);
router.put("/update_password/:id", authMiddleware.verifyToken, updatePasswordUser);
router.delete("/:id", deleteUser);
router.patch("/:id/login", updateLastLogin);

router.post("/login", loginUser);

module.exports = router;
