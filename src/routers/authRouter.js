const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const authController = require("../controller/authController");

router.post("/auth", authController.login);
router.get("/auth", authController.getAllUsers);
router.get("/auth/check", verifyToken, authController.cekUser);
router.post("/auth/register", authController.registerEmployee);
router.patch("/auth/register", verifyToken, authController.updateEmployeeData);
router.get("/auth/role", authController.getRole);

module.exports = router;