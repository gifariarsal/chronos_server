const express = require("express");
const router = express.Router();
const { verifyToken, validateLogin, validateRegister, validateRegisterUpdate, validate } = require("../middleware");
const authController = require("../controller/authController");

router.post("/auth", validateLogin, validate, authController.login);
router.get("/auth", verifyToken, authController.cekUser);

module.exports = router;