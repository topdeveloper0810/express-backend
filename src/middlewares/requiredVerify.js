const User = require("../models/User");

module.exports = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        await User.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(400).json({ msg: "No user." });
            } else if (user.vCode == 1) {
                next();
            } else {
                return res.status(401).json({ msg: "No verified, try verify code" });
            }
        });
    } catch (error) {
        await res.status(500).json({ msg: "Server error(Verify middleware).", error: error.message });
    }
};
