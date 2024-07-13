const User = require("../models/user.js");

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sample_id", url: "sample_url" },
    });

    const token = user.generateToken();

    const tokenOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("token", token, tokenOptions)
      .send({ success: true, newUser });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    // console.log(user);

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "user not found with the email" });
    }

    const isMatched = await user.matchPassword(password);

    if (!isMatched) {
      return res
        .status(400)
        .send({ success: false, message: "incorrect password" });
    }

    const token = user.generateToken();

    const tokenOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("token", token, tokenOptions)
      .send({ success: true, user });
  } catch (error) {
    // console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = { createUser, login };
