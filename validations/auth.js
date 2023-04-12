import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен содержать более 5-ти символов").isLength({
    min: 5,
  }),
  body("fullName", "Имя должно содержать более 3-х символов").isLength({
    min: 3,
  }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
