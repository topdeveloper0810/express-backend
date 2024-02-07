const School = require("../models/School");

const test = async (req, res) => {
  await res.status(200).json({ msg: "Rank is running.." });
};

// @route   GET api/v1/rank/rankschool
// @desc    Get rank of School
// @access  Public
const rankSchool = async (req, res) => {
  try {
    await School.find()
      .sort({ correctAnsNum: -1 })
      .then((schools) =>
        res.status(200).json({ success: true, data: { schools } })
      )
      .catch((err) =>
        res.status(400).json({ msg: "School rank error.", err: err.message })
      );
  } catch (error) {
    res
      .status(500)
      .jsom({ msg: "Server error(School rank).", error: error.message });
  }
};

// @route   GET api/v1/rank/rankuser
// @desc    Get rank of Users in School
// @access  Public
const rankUser = async (req, res) => {
  try {
    // Find the school of the current user
    await School.findOne({ students: req.user._id })
      .populate("students", ["name", "level", "correctQuestions"])
      .then((userSchool) => {
        const students = userSchool.students;        
        res.status(200).json({ success: true, data: { students } });
      })
      .catch((err) =>
        res.status(404).json({ msg: "School not found.", err: err.message })
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Server error(User rank).", error: error.message });
  }
};

module.exports = { test, rankSchool, rankUser };
