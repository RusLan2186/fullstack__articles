import mongoose from 'mongoose'

const UserScema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  avatarUrl: String
}, {
  timestamps: true,
})

export default mongoose.model('User', UserScema)