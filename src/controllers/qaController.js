const Question = require("../models/Question");
const School = require("../models/School");
const User = require("../models/User");

const test = async (req, res) => {
  res.status(200).json({ msg: "Question api is running." });
};

// @route   POST api/v1/qa/addques
// @desc    Add Question
// @access  Private
const addQues = async (req, res) => {
  try {
    const { title, question, topic, level } = req.body;
    const newQuestion = new Question({
      createdBy: req.user._id,
      title: title,
      question: question,
      topic: topic,
      level: level,
    });
    await newQuestion
      .save()
      .then(() =>
        Question.find()
          .sort({ questionDate: -1 })
          .then(
            (questions) =>
              res.status(200).json({ success: true, data: { questions } })
            // res.status(200).json({ success: true })
          )
      )
      .catch((err) =>
        res
          .status(400)
          .json({ msg: "New Question save error", err: err.message })
      );
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error(Add Question).", error: error.message });
  }
};

// @route   DELETE api/v1/qa/deleteques/:deleteques_id
// @desc    Delete Question
// @access  Private
const deleteQues = async (req, res) => {
  try {
    const deleteques_id = req.params.deleteques_id;
    await Question.findByIdAndDelete(deleteques_id)
      .then((deletedQuestion) => {
        if (!deletedQuestion) {
          return res.status(404).json({ msg: "Question not found." });
        } else {
          User.find({ correctQuestions: deleteques_id }).then(
            (usersDeletedQuestion) => {
              usersDeletedQuestion.map((user) => {
                user.correctQuestions = user.correctQuestions.filter(
                  (ques_id) => ques_id.toString() !== deleteques_id
                );
                user.save();
                School.findById(user.school).then((school) => {
                  school.correctAnsNum -= 1;
                  school.save();
                });
              });
            }
          );
          Question.find().then((questions) =>
            res.status(200).json({ success: true, data: { questions } })
          );
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ msg: "Question delete error.", err: err.message });
      });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error(Delete Question).", error: error.message });
  }
};

// @route   GET api/v1/qa/allquesans
// @desc    GEt All Questions and Answers
// @access  Private
const allQuesAns = async (req, res) => {
  try {
    await Question.find()
      .sort({ questionDate: -1 })
      .then((questions) => {
        res.status(200).json({ success: true, data: { questions } });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ msg: "Questions and Answers error.", err: err.message })
      );
  } catch (error) {
    res.status(500).json({
      msg: "Server error(All Question and Answer).",
      error: error.message,
    });
  }
};

// @route   GET api/v1/qa/stuques
// @desc    Get answered Question and Answer for Student.
// @access  Public
const stuQues = async (req, res) => {
  try {
    const student = req.user;
    const questions = await Question.find({ level: student.level });
    if (questions.length > 0) {
      const stuQuestion = questions.map((question) => {
        const stuAnswer = question.answers.find(
          (ans) => ans.student.toString() === student._id.toString()
        );
        return {
          title: question.title,
          question: question.question,
          topic: question.topic,
          level: question.level,
          questionDate: question.questionDate,
          answer: stuAnswer
            ? {
                stuAnswer,
              }
            : null,
        };
      });
      res.status(200).json({ success: true, data: { stuQuestion } });
    } else {
      res.status(404).json({ msg: "Questions not found for the student." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error(Student Question).", error: error.message });
  }
};

// @route   POST api/v1/qa/addans/:ques_id
// @desc    Add Answer
// @access  Public
const addAns = async (req, res) => {
  try {
    const stu_id = req.user._id;
    const ques_id = req.params.ques_id;
    const answerText = req.body.answer; // Renamed to avoid variable name conflict
    await Question.findById(ques_id).then((question) => {
      const answer = question.answers.find(
        (ans) => ans.student.toString() === stu_id.toString()
      );
      if (answer) {
        res.status(400).json({ msg: "Answer already exists." });
      } else {
        if (!answerText) {
          res.status(400).json({ msg: "Answer is required." });
        } else {
          const newAnswer = {
            student: req.user._id,
            answer: answerText,
          };
          question.answers.push(newAnswer);
          question
            .save()
            .then(() =>
              res.status(200).json({ success: true, data: { question } })
            );
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error (Add answer).", error: error.message });
  }
};

// @route   GET api/v1/qa/stuquesans
// @desc    Get answered Question and Answer for Student.
// @access  Public
const stuQuesAns = async (req, res) => {
  try {
    const stu_id = req.user._id;
    const questions = await Question.find({
      "answers.student": stu_id,
    });
    if (questions.length > 0) {
      const stuAnswer = questions.map((question) => {
        const studentAnswer = question.answers.find(
          (ans) => ans.student.toString() === stu_id.toString()
        );
        return {
          title: question.title,
          question: question.question,
          topic: question.topic,
          level: question.level,
          date: question.date,
          answer: studentAnswer
            ? {
                answer: studentAnswer.answer,
                isCorrect: studentAnswer.isCorrect,
                answerDate: studentAnswer.answerDate,
              }
            : null,
        };
      });
      res.status(200).json({ success: true, data: { stuAnswer } });
    } else {
      res
        .status(404)
        .json({ msg: "Answered questions not found for the student." });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Server error(Question and Answer).",
      error: error.message,
    });
  }
};

// @route   POST api/v1/qa/trueans/:ques_id/:ans_id
// @desc    True Answer
// @access  Private
const trueAns = async (req, res) => {
  try {
    const ques_id = req.params.ques_id;
    const ans_id = req.params.ans_id;
    const question = await Question.findById(ques_id);
    const answer = question.answers.find(
      (ans) => ans._id.toString() === ans_id
    );
    if (answer) {
      answer.isCorrect = true;
      await question.save();
      const user = await User.findById(answer.student);
      user.correctQuestions.push(ques_id);
      await user.save();
      const school = await School.findById(user.school);
      school.correctAnsNum += 1;
      await school.save();
      res.status(200).json({ success: true, msg: "Answer marked as correct." });
    } else {
      res.status(404).json({ msg: "Answer not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error (True Answer)." });
  }
};

module.exports = {
  test,
  addQues,
  deleteQues,
  allQuesAns,
  stuQues,
  addAns,
  stuQuesAns,
  trueAns,
};
