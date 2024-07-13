const Post = require("../models/post.js");
const User = require("../models/user.js");

async function createPost(req, res) {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: req.body.public_id,
        url: req.body.url,
      },
      owner: req.user._id,
    };
    const newPost = await Post.create(newPostData);

    const user = await User.findOne({ _id: newPost.owner });

    user.posts.push(newPost._id);

    await user.save();

    res.status(200).send({
      success: true,
      newPost,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

async function likeAndUnlikePost(req, res) {
  try {
    const postId = req.params.id;

    const post = await Post.findById({ _id: postId });

    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "post not found" });
    }
    // const index = findUserInLikesArray(post.likes, req.user._id);

    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).send({ success: true, message: "post unliked" });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).send({ success: true, message: "post liked" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

// function findUserInLikesArray(arr, userId) {
//   const array = [...arr];
//   let index = 0;
//   for (user of array) {
//     if (user._id == userId) {
//       console.log(user._id);
//       return index;
//     }
//     index++;
//   }

//   return -1;
// }

module.exports = { createPost, likeAndUnlikePost };
