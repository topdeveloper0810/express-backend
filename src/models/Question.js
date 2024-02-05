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
  content: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  answer: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      comment: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Question = mongoose.model("question", QuestionSchema);
