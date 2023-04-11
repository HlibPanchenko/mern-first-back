import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось статьи",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // вернем все статьи
    // с помощью populate('user').exect() подключаем связь с одной таблицы на другую
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось статьи",
    });
  }
};

// этот вариант устарел, но тут есть полезные комментарии
// export const getOne = async (req, res) => {
//   try {
//     // вытянем id c поисковой строчки
//     const postId = req.params.id;
//     // найдем статью пo id
//     PostModel.findOneAndUpdate(
//       { _id: postId },
//       // также заодно хотим увеличить коичество просмотров статьи
//       {
//         $inc: { viewsCount: 1 },
//       },
//       // после обновления возвращаем актуальную статью
//       {
//         returnDocument: "after",
//       },
//       //функция которая будет выполняться
//       (err, doc) => {
//         if (err) {
//           console.log(error);
//           return res.status(500).json({
//             message: "Не удалось вернуть статью",
//           });
//         }

//         if (!doc) {
//           return res.status(404).json({
//             message: "Статья не найдена",
//           });
//         }

//         // если ошибок нет и статья найдена, возвращаем документ
//         res.json(doc);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось статьи",
//     });
//   }
// };

export const getOne = async (req, res) => {
  try {
    const postsId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postsId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось найти статью" });
  }
};

export const remove = async (req, res) => {
  try {
    const postsId = req.params.id;

    const deletedPost = await PostModel.findOneAndDelete({ _id: postsId });

    if (!deletedPost) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось найти статью" });
  }
};

export const create = async (req, res) => {
  try {
    // функционал по созданию статьи
    const doc = new PostModel({
      // req.body - то, что передает пользователь
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      // кроме инфы которая поступает от пользователя, есть инфа которую мы должны доверить бекенду
      user: req.userId,
    });

    //Когда документ подготовлен, его нужно создать
    const post = await doc.save();
    // возвращаем ответ
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postsId = req.params.id;

    await PostModel.updateOne(
      { _id: postsId },
      // второй параметр - то, что хотим обновить
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось обновить статью" });
  }
};
