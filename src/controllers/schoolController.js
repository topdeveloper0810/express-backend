const School = require("../models/School");

const test = async (req, res) => {
  try {
    res.status(200).json({ msg: "School api is running." });
  } catch (error) {
    console.log({ error: error });
  }
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
          .catch((err) => console.log(err));
      }
    });
  } catch (error) {
    console.log({ error: error });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const school_id = req.params.school_id;
    await School.findByIdAndDelete(school_id).then((deleteSchool) => {
      if (!deleteSchool) {
        return res.status(400).json({ msg: "School doesn't exist." });
      } else {
        School.find()
          .then((schools) => {
            res.status(200).json({
              success: true,
              data: { schools },
            });
          })
          .catch((err) => console.log(err));
      }
    });
  } catch (error) {
    console.log({ error: error });
  }
};

module.exports = { test, addSchool, deleteSchool };
