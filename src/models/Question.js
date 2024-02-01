const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  question: {
    type: String,
    required: true,
  },
  answer: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      comment:{
        type: String,
        required: true,
      },
      true:{
        type: Boolean,
        required: true,
      },
      date:{
        type: Date,
        default: Date.now
      }
    },
  ],
});

module.exports = Question = mongoose.model("question", QuestionSchema);