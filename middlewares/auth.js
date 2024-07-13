const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

async function isAuthenticated(req, res, next) {
  try {
    const { token } = req.cookies;

    // console.log(token);

    if (!token) {
      return res
        .status(400)
        .send({ success: false, message: "Please login first" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      res.status(400).send({ message: "user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = { isAuthenticated };
