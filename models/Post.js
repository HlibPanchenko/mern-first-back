import mongoose from "mongoose";

// опишем структуру нашей таблицы списка пользователей.
// создадим схему нашей таблицы
// В этой схеме опишем все свойства, какие есть у пользователя
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true, // почта должна быть уникальной
    },
    tags: {
      type: Array,
      // если ничего не передадим, то будет пустой массив
      default: [],
    },
    viewsCount: {
      // количество просмотров статьи
      type: Number,
      default: 0,
    },
    // автор статьи
    user: {
      type: mongoose.Schema.Types.ObjectId, // id пользователя
      ref: "User", // ссылаемся на отдельную модель User
      required: true,
    },
    imageUrl: String,
    avatarUrl: String, // тут required: false поэтому передаем просто type
  },
  // свойства даты создания и обновления
  {
    timestamps: true,
  }
);

// называем схему "User", и передаем саму схему
export default mongoose.model("Post", PostSchema);
