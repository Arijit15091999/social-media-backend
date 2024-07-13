const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  email: {
    type: String,
    required: [true, " please enter an email"],
    unique: [true, "email already exists"],
  },

  password: {
    type: String,
    required: [true, "enter a password"],
    minLength: [6, "password must be of 6 length"],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.generateToken = function() {
  return jwt.sign({_id: this._id, email: this.email, name: this.name}, process.env.JWT_SECRET);
}

module.exports = new mongoose.model("User", userSchema);
