const express = require("express");
const router = express.Router();
const salaryController = require("../controller/salaryController");

router.post("/salary", salaryController.calculateSalary);
router.get("/salary/:userID", salaryController.getSalaryByUserID);

module.exports = router;
