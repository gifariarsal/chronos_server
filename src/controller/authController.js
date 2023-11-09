const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userCheck = await User.findOne({ where: { email } });
      if (!userCheck) return res.status(500).json({ message: "User not found" });

      if (!userCheck.fullName) {
        return res.status(400).json({ message: "Please complete your data" });
      }

      const passwordValid = await bcrypt.compare(password, userCheck.password);
      if (!passwordValid)
        return res.status(400).json({ message: "Incorrect password" });

      const payload = {
        id: userCheck.id,
        email: userCheck.email,
        username: userCheck.username,
        roleID: userCheck.roleID,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      return res.status(200).json({ message: "Login Success!", data: userCheck, token });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  cekUser: async (req, res) => {
    try {
      const { id } = req.user

      const user = await User.findByPk(id, {
        include: { model: db.Role, attributes: ["role"] },
      });
      return res.status(200).json({ message: "success", user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};

module.exports = authController;
