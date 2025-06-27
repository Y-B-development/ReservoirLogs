import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
