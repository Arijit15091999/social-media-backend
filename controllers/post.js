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

    // console.log(req.user._id);

    const post = await Post.findById({ _id: postId });

    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "post not found" });
    }
    const {index, found} = searchUser(post.likes, req.user._id);
    // console.log(post.likes);

    if (found) {
      post.likes.splice(index, 1);
      await post.save();
    // console.log(post.likes);

      return res.status(200).send({ success: true, message: "post unliked" });
    } else {
      post.likes.push(req.user._id);
    // console.log(post.likes);

      await post.save();
      return res.status(200).send({ success: true, message: "post liked" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}


function searchUser(array, userId) {
  let index = 0;
  for (let item of array) {
    if(String(item._id) === String(userId)) {
      return {index, found: true};
    }

    index++;
  }

  return {index:-1, found: false};
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

async function getAllPosts(req, res) {

  try{  
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner : {$in : user.following},
    });

    res.status(200).send({
      success: true,
      posts : posts
    })

  }catch(error) {
    res.status(500).send({success: false, message: error.message});
  }
}

async function updateCaption(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if(!post) {
      return res.status(404).send({success: false, message: "post not found"});
    }

    if(String(post.owner) != String(req.user._id)) {
      return res.status(401).send({success: false, message: "un authorized"});
    }

    post.caption = req.body.caption;

    await post.save();

    return res.status(200).send({success: true, message: "caption updated"});
    
  } catch (error) {
  }
}

async function commentOnPost(req, res) {
  try {

    const post = await Post.findById(req.params.id);

    if(!post) {
      return res.status(404).send({success: false, message: "post not found"});
    }

    let commentOfTheUserExist = false;

    [...post.comments].forEach(async function(item) {
      if(String(item.user) === String(req.user._id)) {
        commentOfTheUserExist = true;
        item.comment = req.body.comment;
        return res.status(200).send({success: true, message: "comment Updated"});
      }

    });

    if(!commentOfTheUserExist) {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment
      });
    }

    await post.save();

    return res.status(200).send({success: true, message: "comment added"});

    
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
}



module.exports = { createPost, likeAndUnlikePost, deletePost, searchUser, getAllPosts, updateCaption, commentOnPost };
