import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
})

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
      required: true,
    },
    log: [logSchema],
  },
  {
    versionKey: false,
    collection: 'users',
  }
)

const UserModel = mongoose.model('User', userSchema)

export default UserModel
