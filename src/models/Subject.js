const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  subjectName: {
    type: String,
    required: [true, "Subject is required!"],
    unquie: true,
  },
  topic: [
    {
      type: String,
      required: [true, "Topic is required!"],
      unique: true,
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
