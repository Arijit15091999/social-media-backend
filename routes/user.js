const express = require("express");
const { createUser, login, followAndUnfollowUser, logout, updatePassword, updateProfile } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/user/create").post(createUser);
router.route("/user/login").post(login);
router.route("/user/logout").get(logout);
router.route("/update/profile").post(isAuthenticated ,updateProfile);
router.route("/update/password").post(isAuthenticated ,updatePassword);
router.route("/user/follow/:id").get(isAuthenticated, followAndUnfollowUser)

module.exports = router;