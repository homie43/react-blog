import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

// регистрация
export const register = async (req, res) => {
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
};

// авторизация
export const login = async (req, res) => {
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
        message: "Неверный логин или пароль",
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
};

// проверка наличия пользователя
export const getMe = async (req, res) => {
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
};
