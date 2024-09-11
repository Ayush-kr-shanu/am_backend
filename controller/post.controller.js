const httpStatus = require("http-status");
const { Post } = require("../model");
const { getFile } = require("./file.controller");

const addPost = async (request, response) => {
  try {
    const { title, description, fileName, userId } = request.body;
    if (!title || !description || !fileName || !userId) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "All fields are required" });
    }
    const post = new Post({ title, description, fileName, userId });
    await post.save();
    return response.status(httpStatus.CREATED).send(post);
  } catch (error) {
    return response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const getAllPosts = async (request, response) => {
  try {
    let posts = await Post.find().populate(
      "userId",
      "firstName lastName email phone profilePicture"
    );
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].fileName) {
        posts[i] = {
          ...posts[i]._doc,
          videoUrl: await getFile(`video/${posts[i].fileName}`, true),
        };
      }

      if (posts[i].userId && posts[i].userId.profilePicture) {
        posts[i].userId = {
          ...posts[i].userId._doc,
          profilePictureUrl: await getFile(
            `profile-pic/${posts[i].userId.profilePicture}`,
            true
          ),
        };
      }
    }
    return response.status(httpStatus.OK).send(posts);
  } catch (error) {
    return response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const getPostByUserId = async (request, response) => {
  try {
    const { userId } = request.params;
    let posts = await Post.find({ userId }).populate(
      "userId",
      "firstName lastName email phone profilePicture"
    );

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].fileName) {
        posts[i] = {
          ...posts[i]._doc,
          videoUrl: await getFile(`video/${posts[i].fileName}`, true),
        };
      }
      if (posts[i].userId && posts[i].userId.profilePicture) {
        posts[i].userId = {
          ...posts[i].userId._doc,
          profilePictureUrl: await getFile(
            `profile-pic/${posts[i].userId.profilePicture}`,
            true
          ),
        };
      }
    }
    return response.status(httpStatus.OK).send(posts);
  } catch (error) {
    return response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const getPostById = async (request, response) => {
  try {
    const { id } = request.params;
    let post = await Post.findById(id).populate(
      "userId",
      "firstName lastName email phone profilePicture"
    );
    if (!post) {
      return response
        .status(httpStatus.NOT_FOUND)
        .send({ message: "Post not found" });
    }

    if (post.fileName) {
      post = {
        ...post._doc,
        videoUrl: await getFile(`video/${post.fileName}`),
      };
    }

    if (post.userId && post.userId.profilePicture) {
      post.userId = {
        ...post.userId._doc,
        profilePictureUrl: await getFile(
          `profile-pic/${post.userId.profilePicture}`
        ),
      };
    }
    return response.status(httpStatus.OK).send(post);
  } catch (error) {
    return response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const updatePost = async (request, response) => {
  try {
    // user who created the post can update the post
    const { title, description, fileName } = request.body;
    const { id } = request.params;
    const userId = request.user.id;

    let post = await Post.findByIdAndUpdate(
      id,
      { title, description, fileName },
      { new: true }
    ).populate("userId", "firstName lastName email phone profilePicture");

    if (!post) {
      return response
        .status(httpStatus.NOT_FOUND)
        .send({ message: "Post not found" });
    }

    if (post.userId.id !== userId) {
      return response
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized to update this post" });
    }

    if (fileName) {
      post.fileName = fileName;
      await post.save();
    }

    if (post.fileName) {
      post = {
        ...post._doc,
        videoUrl: await getFile(`video/${post.fileName}`),
      };
    }

    if (post.userId && post.userId.profilePicture) {
      post.userId = {
        ...post.userId._doc,
        profilePictureUrl: await getFile(
          `profile-pic/${post.userId.profilePicture}`
        ),
      };
    }

    return response.status(httpStatus.OK).send(post);
  } catch (error) {
    return response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const deletePost = async (request, response) => {
  try {
    // user who created the post can delete the post
    const { id } = request.params;
    const userId = request.user.id;

    let post = await Post.findByIdAndDelete(id);

    if (!post) {
      return response
       .status(httpStatus.NOT_FOUND)
       .send({ message: "Post not found" });
    }

    return response.send({message: "Deleted post successfully" });
  } catch (error) {
    return response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getPostByUserId,
  getPostById,
  updatePost,
  deletePost,
};
