export const createPost = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пост",
    });
  }
};
