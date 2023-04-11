import { body } from "express-validator";

//с помощью функции body() юудем проверять есть ли какая-то информация в теле запроса

export const registerValidation = [
  // если в теле запроса есть "email", проверим отвечает ли он условиям почты
  body("email", "неверный формат почты").isEmail(),
  // пароль проверим на длину
  body("password", "пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "имя должно содержать больше 2 букв").isLength({ min: 3 }),
  // если не придет запрос, ничего страшного, так как аватар это опционально
  body("avatarUrl", "неверная ссылка на картинку").optional().isURL(),
];

export const loginValidation = [
  // если в теле запроса есть "email", проверим отвечает ли он условиям почты
  body("email", "неверный формат почты").isEmail(),
  // пароль проверим на длину
  body("password", "пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }),
];

// валидация для создания статьи
export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тегов (укажите массив)").optional().isString(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
