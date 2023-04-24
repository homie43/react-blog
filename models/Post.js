import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    imageUrl: String,
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // специальный тип
      ref: "User", // ссылается на отдельную модель - юзера
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
