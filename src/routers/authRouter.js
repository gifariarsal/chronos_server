const express = require("express");
const router = express.Router();
const { verifyToken, validateLogin, validateRegister, validateRegisterUpdate, validate } = require("../middleware");
const authController = require("../controller/authController");

router.post("/auth", validateLogin, validate, authController.login);
router.get("/auth", authController.getAllUsers);
router.get("/auth/check", verifyToken, authController.cekUser);
router.post("/auth/register", validateRegister, validate, authController.registerEmployee);
router.patch("/auth/register", verifyToken, validateRegisterUpdate, validate, authController.updateEmployeeData);
router.get("/auth/role", authController.getRole);

module.exports = router;