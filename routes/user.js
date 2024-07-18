const express = require("express");
const { createUser, login, followAndUnfollowUser, logout, updatePassword, updateProfile, deleteMyProfile, findMyProfile, getUserProfile, getAllUsers } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/user/create").post(createUser);
router.route("/user/login").post(login);
router.route("/user/logout").get(logout);
router.route("/update/profile").post(isAuthenticated ,updateProfile);
router.route("/update/password").post(isAuthenticated ,updatePassword);
router.route("/user/follow/:id").get(isAuthenticated, followAndUnfollowUser)
router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);
router.route("/me").get(isAuthenticated, findMyProfile);
router.route("/user/:id").get(getUserProfile);
router.route("/users").get(getAllUsers);

module.exports = router;