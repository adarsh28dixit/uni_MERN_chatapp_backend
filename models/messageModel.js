const mongoose = require('mongoose')
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
        type: String,
      },
      senderId: {
        type: String,
      },
      text: {
        type: String,
      },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message