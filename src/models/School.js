const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    schoolName: {
        type: String,
        required: true,
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
    ],
    correctStudents: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = School = mongoose.model("schools", SchoolSchema);
