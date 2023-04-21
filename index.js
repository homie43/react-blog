import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.k8gbj8e.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

// комманда позволяет читать json который приходит в запросах
app.use(express.json());

// авторизация
app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); // ищем юзера в бд

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден", // то что пользоваетль не найден писать не надо
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(404).json({
        message: "Неверный логин или пароль", // то что пользоваетль не найден писать не надо
      });
    }

    const token = jwt.sign(
      {
        _id: user._id, // что шифруем
      },
      "secret123", // ключ с помощью которого шифруется токен
      {
        expiresIn: "30d", // срок жизни токена
      }
    );

    const { passwordHash, ...userData } = user._doc; // убираем пароль из ответа

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
});

// регистрация
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // шифруем пароль с помощью bcrypt
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // создаем документ
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash, // используем зашифрованный пароль
    });

    const user = await doc.save();

    // создаем токен
    const token = jwt.sign(
      {
        _id: user._id, // что шифруем
      },
      "secret123", // ключ с помощью которого шифруется токен
      {
        expiresIn: "30d", // срок жизни токена
      }
    );

    const { passwordHash, ...userData } = user._doc; // убираем пароль из ответа

    res.json({
      ...userData,
      token,
    });
    // возвращается только один ответ, более быть не может
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегестрироваться",
    });
  }
});

// получение информации о себе
// проверка авторизован я или нет
app.get("/auth/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя нет",
      });
    }

    const { passwordHash, ...userData } = user._doc; // убираем пароль из ответа
    res.json({
      userData,
    });
  } catch (error) {}
});

// запускаем приложение
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
