const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      reuired: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
