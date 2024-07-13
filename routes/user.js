const express = require("express");
const { createUser, login, followAndUnfollowUser } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/user/create").post(createUser);
router.route("/user/login").post(login);
router.route("/user/:id").get(isAuthenticated, followAndUnfollowUser)

module.exports = router;