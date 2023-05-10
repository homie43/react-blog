import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect("mongodb+srv://admin:wwwwww@cluster0.k8gbj8e.mongodb.net/blog?retryWrites=true&w=majority")
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

// хранилище для файлов(картинок)
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// комманда позволяет читать json который приходит в запросах
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// юзеры
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// посты
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

// запускаем приложение
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
