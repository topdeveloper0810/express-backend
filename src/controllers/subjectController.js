const Subject = require("../models/Subject");

const test = async (req, res) => {
  res.status(200).json({ msg: "Subject api is running." });
};

// @route   GET api/v1/subject/all
// @desc    All Schools
// @access  Publish
const all = async (req, res) => {
  try {
    await Subject.find()
      .then(
        (subjects) => {
          const allSubjects = subjects.map((subject) => {
            const questionNum = subject.questions.length();
            return {
              name: subject.name,
              questionNum: questionNum,
            };
          });

          res.status(200).json({ success: true, data: { allSubjects } })
        }
      )
      .catch((err) =>
        res.status(500).json({ msg: "Subjects not found.", err: err.message })
      );
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error(All Subjects).", error: error.message });
  }
};

// @route   POST api/v1/subject/add
// @desc    Add Schools
// @access  Private
const addSubject = async (req, res) => {
  try {
    const { name } = req.body;
    await Subject.findOne({ name: name }).then((subject) => {
      if (subject) {
        return res.status(400).json({ msg: "Subject already exists." });
      } else {
        const newSubject = new Subject({
          name: name,
        });
        newSubject
          .save()
          .then(() =>
            Subject.find().then((subjects) => {
              res.status(200).json({ success: true, data: { subjects } });
            })
          )
          .catch((err) =>
            res.status(500).json({ msg: "New Subject save error." })
          );
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error(Add Subject)", error: error.message });
  }
};

// @route   POST api/v1/subject/delete/:subject_id
// @desc    Delete subject
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject_id = req.params.subject_id;
    await Subject.findByIdAndDelete(subject_id).then((deleteSubject) => {
      if (!deleteSubject) {
        return res.status(400).json({ msg: "Subject not found." });
      } else {
        Subject.find().then((subjects) => {
          res.status(200).json({
            success: true,
            data: { subjects },
          });
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error(Delete Subject)", error: error.message });
  }
};

module.exports = { test, all, addSubject, deleteSubject };
