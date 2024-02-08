const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: [true, "Subject is required!"],
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "questions",
    },
  ],
});

module.exports = Subject = mongoose.model("subjects", SubjectSchema);
