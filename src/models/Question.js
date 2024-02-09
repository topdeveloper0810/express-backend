const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  topic: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  subject: {
    // type: String,
    // required: true,
    type: Schema.Types.ObjectId,
    ref: "subjects",
  },
  level: {
    type: String,
    // enum: ["beginner", "intermediate", "advanced"],
    // default: "beginner",
    enum: ["Iniciante", "Intermediário", "Avançado"],
    default: "Iniciante",
  },
  questionDate: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      answer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
      answerDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Question = mongoose.model("questions", QuestionSchema);
