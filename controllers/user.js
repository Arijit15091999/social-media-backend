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


async function logout(req, res) {
  try {

    res.status(200).cookie("token", null, {
      expires: new Date(Date.now()), httpOnly: true
    }).json({success: true, message: "logged out"});
    
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}


async function followAndUnfollowUser(req, res) {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user._id;

    console.log(targetUserId, loggedInUserId);

    const targetUser = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if(String(targetUser._id) === String(loggedInUser._id)) {
      return res.status(400).send({success: false, message: "can not follow self"})
    }

    const {index: index1, found: found1} = searchUser(loggedInUser.following, targetUserId);
    // console.log(index1, found1);

    const {index: index2, found: found2} = searchUser(targetUser.followers, loggedInUserId);
    // console.log(index2, found2);

    if(found1) {
      
      loggedInUser.following.splice(index1, 1);
      // console.log(loggedInUser.following)


      targetUser.followers.splice(index2, 1);
      // console.log(targetUser.followers);

      await loggedInUser.save();
      await targetUser.save();

      res.status(200).send({success: true, message: "unfollowed"})
    }
    else{
      targetUser.followers.push(loggedInUser._id);
      loggedInUser.following.push(targetUser._id);

      await targetUser.save();
      await loggedInUser.save();

      res.status(200).send({success:true, message: "followed"})
    }

    // console.log(targetUser.followers);
    // console.log(loggedInUser.following);
    // res.status(200).send({success:true, message: "followed"})

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
  
}

async function updatePassword(req, res) {
  try {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user._id);

    console.log(oldPassword, newPassword, user);

    const isMatched = await user.matchPassword(oldPassword);

    if(!isMatched) {
      return res.status(400).send({success:false, message: "wrong password"});
    }

    const isSameAsOldOne = await user.matchPassword(newPassword);

    if(isSameAsOldOne) {
      return res.status(400).send({success:false, message: "please provide a new password"});
    }

    user.password = newPassword;

    await user.save();

    res.status(200).send({success: true, message: "password changed"})
    
  } catch (error) {
    res.status(500).send({success: false, message: error.message})
  }
}

async function updateProfile(req, res) {
  try {
    const{name, email} = req.body;
    const user = await User.fineById(req.user._id);

    if(name) user.name = name;

    if(email) user.email = email;

    //to fo avatar

    await user.save();

    res.status(200).send({success: true, message: "updated profile"})
  } catch (error) {
    res.status(500).send({success: false, message : error.message});
  }
}

module.exports = { createUser, login, followAndUnfollowUser, logout, updatePassword, updateProfile };
