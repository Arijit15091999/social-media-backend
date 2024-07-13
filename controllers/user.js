const User = require("../models/user.js");
const { searchUser } = require("./post.js");

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;


    const newUser = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sample_id", url: "sample_url" },
    });

    const token = newUser.generateToken();

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

async function followAndUnfollowUser(req, res) {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    const {index: index1, found} = searchUser(targetUser.followers, loggedInUserId);
    
    if(found) {
      targetUser.splice(index1, 1);
      await targetUser.save();

      const {index: index2, found} = searchUser(loggedInUser.following, targetUserId);

      loggedInUser.following.splice(index2, 1);

      await loggedInUser.save();

      return res.status(200).send({success: true, message: "unfollowed"})
    }
    else{
      targetUser.followers.push(loggedInUserId);
      loggedInUser.following.push(targetUserId);

      await targetUser.save();
      await loggedInUser.save();

      return res.status(200).send({success:true, message: "followed"})
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = { createUser, login, followAndUnfollowUser };
