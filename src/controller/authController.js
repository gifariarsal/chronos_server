const db = require("../../models");
const User = db.User;
const { Op } = require("sequelize");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const transporter = require("../helpers/transporter");

const registrationEmail = async (email, user) => {
  let payload = { id: user.id };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  const redirect = `http://localhost:3000/register/${token}`;
  const data = await fs.readFile(path.resolve(__dirname, "../emails/registerEmployee.html"), "utf-8");
  const tesCompile = handlebars.compile(data);
  const tempResult = tesCompile({ email, redirect });

  await transporter.sendMail({
    to: email,
    subject: "Register Employee",
    html: tempResult,
  });
};

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(500).json({ message: "User not Found" });
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        return res.status(400).json({ message: "Incorrect password" });
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "24h",
      });
      user.isLogin = true;
      await user.save();
      return res.status(200).json({ message: "Login Success!", user, token });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  registerEmployee: async (req, res) => {
    try {
      const { email, roleID, daySalary, baseSalary } = req.body;
      if (!email || !roleID || !daySalary || !baseSalary) {
        return res.status(400).json({ error: "Missing some data" });
      }
      const cekUser = await User.findOne({ where: { [Op.or]: [{ email }] } });
      if (cekUser)
        return res.status(400).json({ message: "Email is already registered" });

      db.sequelize.transaction(async (t) => {
        const user = await User.create(
          { email, roleID, baseSalary, daySalary },
          { transaction: t }
        );
        await registrationEmail(email, user);
        return res.status(200).json({ message: "Register Success!", user });
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  updateEmployeeData: async (req, res) => {
    try {
      const { fullname, birthday, username, password } = req.body;
      if (!fullname || !birthday || !username || !password)
        return res.status(400).json({ error: "Missing some data" });

      const cekUser = await User.findByPk(req.user.id);
      if (cekUser.fullName) return res.status(400).json({ message: "Link expired. Data already updated" });
      console.log(cekUser);

      db.sequelize.transaction(async (t) => {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        cekUser.fullName = fullname;
        cekUser.birthday = new Date(birthday);
        cekUser.username = username;
        cekUser.password = hashPassword;
        await cekUser.save(), { transaction: t };
        return res.status(200).json({ message: "Register Success" });
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  getRole: async (req, res) => {
    try {
      const result = await db.Role.findAll({
        where: {
          id: { [Op.gt]: 1 },
        },
      });
      return res.status(200).json({ message: "Success", result });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      return res.status(200).json({ message: "success", users });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  cekUser: async (req, res) => {
    try {
      const user = await db.User.findByPk(req.user.id, {
        include: { model: db.Role, attributes: ["role"] },
      });
      return res.status(200).json({ message: "success", user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};

module.exports = authController;
