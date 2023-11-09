const db = require("../models");
const moment = require("moment");

const isClockedIn = async (userID, date) => {
  const existingHistory = await db.History.findOne({
    where: {
      userID,
      ClockIn: {
        [db.Sequelize.Op.gte]: new Date(date).setHours(0, 0, 0, 0),
        [db.Sequelize.Op.lt]: new Date(date).setHours(23, 59, 59, 999),
      },
    },
  });
  return existingHistory !== null;
};

const attendanceController = {
  clockIn: async (req, res) => {
    try {
      const { userID } = req.body;
      const user = await db.User.findOne({
        where: { id: userID },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const now = moment();

      let workStartTime, workEndTime;
      if (user.roleID === 2) {
        workStartTime = moment().set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
        workEndTime = moment().set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
      } else if (user.roleID === 3) {
        workStartTime = moment().set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
        workEndTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(1, 'days');
      }

      if (now.isBefore(workStartTime) || now.isAfter(workEndTime)) {
        return res.status(400).json({ message: "Clock in is allowed only during working hours" });
      }

      if (await isClockedIn(userID, now)) {
        return res.status(400).json({ message: "User is already clocked in today" });
      }

      const month = now.month() + 1;

      await db.History.create({
        userID,
        ClockIn: now.toDate(),
        ClockOut: null,
        HourlyWorks: 0,
        DaySalary: 0,
        isOvertime: false,
        Month: month,
      });

      res.status(200).json({ message: "Clock In Successful", userID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  clockOut: async (req, res) => {
    try {
      const { userID } = req.body;

      const history = await db.History.findOne({
        where: { userID, ClockOut: null },
        order: [["ClockIn", "DESC"]],
      });

      const user = await db.User.findOne({
        where: { id: userID },
      });

      if (!history) {
        return res.status(400).json({ message: "User is not clocked in" });
      }

      history.ClockOut = new Date();
      const timeDiffMilliseconds = history.ClockOut - history.ClockIn;
      const hoursWorked = timeDiffMilliseconds / (1000 * 60 * 60);

      history.HourlyWorks = hoursWorked;

      if (hoursWorked > 8) {
        history.DaySalary = user.daySalary / 2;
        history.Deduction = user.daySalary / 2;
      } else if (!history.ClockIn) {
        history.DaySalary = 0;
        history.Deduction = user.daySalary;
      } else if (hoursWorked <= 7) {
        history.DaySalary = user.daySalary / 2;
        history.Deduction = user.daySalary / 2;
      }

      await history.save();
      await user.update({
        income: user.income + history.DaySalary,
      });

      res.status(200).json({ message: "Clock Out Successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  getHistoryByUserId: async (req, res) => {
    try {
      const { userID } = req.params;

      const historyRecords = await db.History.findAll({
        where: { userID },
      });

      res.status(200).json({ message: "Success", history: historyRecords });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = attendanceController;
