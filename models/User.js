import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // почта юзера должжна быть уникальной
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String, // если это свойство не обязательно, то это не объект, как выше
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
