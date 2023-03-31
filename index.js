import express from "express";

const app = express();

// комманда позволяет читать json который приходит в запросах
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);
  res.json({
    success: true,
  });
});

// отправляем логи и пароль? затем обрабатываем их

// запускаем приложение
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
