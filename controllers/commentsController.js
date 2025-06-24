import CommentModel from '../models/Comments.js';

export const createComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: req.params.postId,
      user: req.userId,
    });

    const comment = await doc.save();
    await comment.populate('user'); 

    res.json(comment);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await CommentModel.find({ post: req.params.postId })
      .populate('user', ['fullName', 'avatarUrl'])
      .exec();

    res.json(comments);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: 'Failed to load comment' });
  }
};

export const getLastCommentsGlobal = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', ['fullName', 'avatarUrl'])
      .exec();

    res.json(comments);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: 'Unable to retrieve latest comments' });
  }
};
