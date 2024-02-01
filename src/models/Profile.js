const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  school: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
