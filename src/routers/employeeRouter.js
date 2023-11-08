const express = require("express");
const router = express.Router();
const {
  verifyToken,
  validateRegister,
  validateRegisterUpdate,
  validate,
} = require("../middleware");
const employeeController = require("../controller/employeeController");

router.post("/employee", validateRegister, validate, employeeController.registerEmployee);
router.get("/employee", employeeController.getAllEmployees);
router.patch("/employee", verifyToken, validateRegisterUpdate, employeeController.updateEmployeeData);
router.get("/employee/role", employeeController.getRole);

module.exports = router;