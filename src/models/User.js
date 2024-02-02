const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: [true, "Email already exist."],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  role: {
    type: String,
    required: true,
    default: "student",
  },
  vCode: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// UserSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const passwordGenSalt = bcrypt.genSaltSync(10);
//     this.password = bcrypt.hashSync(this.password, passwordGenSalt);
//   }
//   next();
// });

module.exports = User = mongoose.model("users", UserSchema);
