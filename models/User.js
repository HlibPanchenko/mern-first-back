import mongoose from "mongoose";

// опишем структуру нашей таблицы списка пользователей.
// создадим схему нашей таблицы
// В этой схеме опишем все свойства, какие есть у пользователя
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // почта должна быть уникальной
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String, // тут required: false поэтому передаем просто type
  },
  // свойства даты создания и обновления
  {
    timestamps: true,
  }
);

// называем схему "User", и передаем саму схему
export default mongoose.model("User", UserSchema);
