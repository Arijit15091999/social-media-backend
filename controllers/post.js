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

    console.log(req.user._id);

    const post = await Post.findById({ _id: postId });

    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "post not found" });
    }
    const index = findUserInLikesArray(post.likes, req.user._id);
    console.log(user);
    
    if (post.likes.includes(index != -1)) {
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

function findUserInLikesArray(array, userId) {
  let index = 0;
  for (let item of array) {
    if(String(item) === String(userId)) {
      return index;
    }

    index++;
  }

  return -1;
}

async function deletePost(req, res){
  try {
    const postId = req.params.id;
    
    const post = await Post.findById({_id: postId});

    if(!post){
      res.status(404).send({message:"post not found"});
    }

    const ownderId = post.owner;

    const user = await User.findById({_id:ownderId});

    if(!user){
      res.status(404).send({message:"user not found"});
    }

    const index = user.posts.indexOf(postId);

    user.posts.splice(index, 1);

    await user.save();

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = { createPost, likeAndUnlikePost, deletePost };
