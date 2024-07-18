const express = require("express");
const { createPost, likeAndUnlikePost, getAllPosts, updateCaption, deletePost, commentOnPost } = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth.js");

const router = express.Router();

router.route("/post/getall").get(isAuthenticated, getAllPosts);
router.route("/post/create").post(isAuthenticated, createPost);
router.route("/post/:id")
.get(isAuthenticated, likeAndUnlikePost)
.put(isAuthenticated, updateCaption)
.delete(isAuthenticated, deletePost);
router.route("/post/comment/:id").put(isAuthenticated, commentOnPost);

module.exports = router;
