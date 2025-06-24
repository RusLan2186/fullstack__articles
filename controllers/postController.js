import postModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
  try {
    const posts = await postModel.find().limit(5).exec()

    const tags = posts.map(obj =>obj.tags).flat().slice(0, 5)
    if (!tags.length) {
      return res.status(404).json({
        message: 'No tags found',
      });
    }

    res.json(tags)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Cannot get tags'
    })
  }
}

export const getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.tag; 

    const posts = await postModel.find({ tags: tag }).sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(404).json({ message: `Posts with tag "${tag}" not found` });
    }

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get posts by tag' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().populate({ path: 'user', select: ['fullName', 'avatarUrl'] }).exec()

    if (!posts.length) {
      return res.status(404).json({
        message: 'No posts found',
      });
    }

    res.json(posts)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Cannot get posts'
    })
  }
}

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await postModel
      .findOneAndUpdate(
        { _id: postId },
        { $inc: { viewsCount: 1 } },
        { new: true }
      )
      .populate({ path: 'user', select: ['fullName', 'avatarUrl'] }) // 👈 ключевой момент
      .exec();

    if (!doc) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Cannot get post',
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new postModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId
    })

    const post = await doc.save()
    res.json(post)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Cannot create post'
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }


    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'No permission to delete this post' });
    }

    await postModel.findByIdAndDelete(postId);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cannot delete post' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }


    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'No permission to update this post' });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
      },
      { new: true }
    );

    res.json({
      success: true,
      post: updatedPost,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cannot update post' });
  }
};

export const getPopularPosts = async (req, res) => {
  try {
    const posts = await postModel.find().sort({ viewsCount: -1 }).exec();
    res.json(posts);
  } catch (err) {
    console.error('Error in getPopularPosts:', err);
    res.status(500).json({ message: 'Failed to get popular posts' });
  }
};