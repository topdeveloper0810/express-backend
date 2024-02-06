const express = require("express");
const router = express.Router();

const qaController = require("../../controllers/qaController");
const requiredAdmin = require("../../middlewares/requiredAdmin");
const requiredAuth = require("../../middlewares/requiredAuth");

router.get("/", qaController.test);
router.post("/addques", requiredAuth, requiredAdmin, qaController.addQues);
router.delete(
  "/deleteques/:deleteques_id",
  requiredAuth,
  requiredAdmin,
  qaController.deleteQues
);
router.get("/allquesans", requiredAuth, requiredAdmin, qaController.allQuesAns);
router.post("/addans/:ques_id", requiredAuth, qaController.addAns);
router.get("/stuquesans", requiredAuth, qaController.stuQuesAns);
router.post("/trueans/:ques_id/:ans_id", requiredAuth, requiredAdmin, qaController.trueAns);

module.exports = router;

// const deleteQues = async (req, res) => {
//     try {
//       const deleteques_id = req.params.deleteques_id;
  
//       // Find the question by ID and delete it
//       const deletedQuestion = await Question.findByIdAndDelete(deleteques_id);
//       if (!deletedQuestion) {
//         return res.status(404).json({ msg: "Question doesn't exist." });
//       }
  
//       // Update related user and school information
//       const user = await User.findOne({ correctQuestions: deleteques_id });
//       if (user) {
//         const questionIndex = user.correctQuestions.indexOf(deleteques_id);
//         if (questionIndex !== -1) {
//           user.correctQuestions.splice(questionIndex, 1);
//           await user.save();
//         }
  
//         const school = await School.findById(user.school);
//         if (school) {
//           school.correctAnsNum -= 1;
//           await school.save();
//         }
//       }
  
//       // Retrieve the updated list of questions
//       const questions = await Question.find();
//       res.status(200).json({ success: true, data: { questions } });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ msg: "Server error (Delete Question).", error: error });
//     }
//   };
  