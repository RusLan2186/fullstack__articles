import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

      viewsCount: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Comment', CommentSchema);
