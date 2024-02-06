const School = require("../models/School");

const test = async (req, res) => {
  res.status(200).json({ msg: "School api is running." });
};

const addSchool = async (req, res) => {
  try {
    const { schoolName } = req.body;
    await School.findOne({ schoolName: schoolName }).then((school) => {
      if (school) {
        return res.status(400).json({ msg: "School already exists." });
      } else {
        const newSchool = new School({
          schoolName: schoolName,
        });
        newSchool
          .save()
          .then(() =>
            School.find().then((schools) => {
              res.status(200).json({ success: true, data: { schools } });
            })
          )
          .catch((err) =>
            res.status(500).json({ msg: "New School save error." })
          );
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error(Add School)", error: error });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const school_id = req.params.school_id;
    await School.findByIdAndDelete(school_id).then((deleteSchool) => {
      if (!deleteSchool) {
        return res.status(400).json({ msg: "School not found." });
      } else {
        School.find().then((schools) => {
          res.status(200).json({
            success: true,
            data: { schools },
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error(Delete School)", error: error });
  }
};

module.exports = { test, addSchool, deleteSchool };
