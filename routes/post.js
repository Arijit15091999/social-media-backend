const express = require("express");
const { createPost, likeAndUnlikePost, getAllPosts } = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth.js");

const router = express.Router();

router.route("/post/getall").get(isAuthenticated, getAllPosts);
router.route("/post/create").post(isAuthenticated, createPost);
router.route("/post/:id").get(isAuthenticated, likeAndUnlikePost);

module.exports = router;
