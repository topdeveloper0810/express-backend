const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  subjectName: {
    type: String,
    required: [true, "Subject is required!"],
    unique: [true, "Subject already exists."],
  },
  topic: [
    {
      type: String,
      required: [true, "Topic is required!"],
      unique: [true, "Topic already exists."],
    },
  ],
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "questions",
    },
  ],
});

module.exports = Subject = mongoose.model("subjects", SubjectSchema);
