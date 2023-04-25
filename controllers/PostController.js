import PostModel from "../models/Post.js";

// получение постов
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить посты",
    });
  }
};

// получение одного поста
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId, // по какому парраметру ищем
      },
      {
        $inc: { viewsCount: 1 }, // что делаем - увеличиваем проссмотр на 1
      },
      {
        returnDocument: "after", // после обновления хотим вернуть акьуальный документ
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось вернуть пост",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Пост не найден",
          });
        }

        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пост",
    });
  }
};

// получение одного поста
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось вернуть пост",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Пост не найден",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пост",
    });
  }
};

// создание поста
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      viewsCount: req.body.viewsCount,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};
