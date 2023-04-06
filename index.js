import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.k8gbj8e.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

// комманда позволяет читать json который приходит в запросах
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body.email);

  if (req.body.email === "test@test.ru") {
    const token = jwt.sign(
      {
        email: req.body.email,
        fullName: "Вася Пупкин",
      },
      "secret123"
    );
  }

  res.json({
    success: true,
    token,
  });
});

// отправляем логи и пароль, затем обрабатываем их

// запускаем приложение
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
