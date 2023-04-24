import express from "express";
import mongoose from "mongoose";

import { registerValidation, loginValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.k8gbj8e.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

// комманда позволяет читать json который приходит в запросах
app.use(express.json());

// регистрация
app.post("/auth/register", registerValidation, register);

// авторизация
app.post("/auth/login", loginValidation, login);

// проверка наличия пользователя
app.get("/auth/me", checkAuth, getMe);

// запускаем приложение
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
