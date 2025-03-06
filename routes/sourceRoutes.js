const express = require("express");
const router = express.Router();
const sourceController = require("../controllers/sourceController");
const upload = require("../utils/uploadMiddleware");
const authMiddleware = require("../utils/tokenMiddleware");

router.post(
  "/upload",
  authMiddleware.verifyToken,
  upload.single("file"),
  sourceController.uploadSource
);

router.get("/", authMiddleware.verifyToken, sourceController.getAllSources);

module.exports = router;
