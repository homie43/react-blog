import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("111 Hello World");
});

// запускаем приложение
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
