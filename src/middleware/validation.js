const { body, validationResult } = require("express-validator");

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("roleID").notEmpty().withMessage("Role is required"),
  body("baseSalary")
    .notEmpty()
    .withMessage("Base salary is required")
    .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/)
    .withMessage("Must contains only digits"),
  body("daySalary")
    .notEmpty()
    .withMessage("Day salary is required")
    .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/)
    .withMessage("Must contains only digits"),
];

const validateRegisterUpdate = [
  body("fullname").notEmpty().withMessage("Fullname is required"),
  body("birthday").notEmpty().withMessage("Birthday is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/)
    .withMessage(
      "Password must be at least 8 characters, 1 symbol, and 1 uppercase"
    ),
];

const validate = (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateRegisterUpdate,
  validate,
};
