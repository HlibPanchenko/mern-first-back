import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validations.js";
import { checkAuth, handleValidationsErrors } from "./utils/index.js";
import cors from "cors";

// controllers
// import {getMe, login, register} from './controllers/UserController.js'
import { PostController, UserController } from "./controllers/index.js";

//хотим подключиться с помощью mongoose к MongoDB.
mongoose
  .connect(
    // подключимся не просто к серваку, а именно к бд blog
    "mongodb+srv://glebpanchenk7:DOfc1lvBcDsv6Alk@cluster1.hmowy62.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB  ok");
  })
  .catch((err) => {
    console.log("DB  err", err);
  });

// Создадим express приложение
// вся логика express находится в переменной app
const app = express();

// создаем хранилище для картинок
const storage = multer.diskStorage({
  // путь куда будем сохранять каринки
  // когда будет создаваться хранилище, выполнится функция destination
  destination: (_, __, callback) => {
    // callback сохранит файлы в папку uploads
    callback(null, "uploads");
  },
  // name of file
  filename: (_, file, callback) => {
    // callback сохранит файлы в папку uploads
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

//Мы должны научить наше приложение читать json запросы.
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// укажем роут, что будет происходить при отправке запроса
// в req хранится инфа о том, что нам писал клиент с фронта
// res - инфа о том что мы будем передавать клиенту

// когда прийдет post запрос на этот адресс, мы его отловим
// регистрация
app.post(
  "/auth/register",
  registerValidation,
  handleValidationsErrors,
  UserController.register
);

// авторизация
app.post(
  "/auth/login",
  loginValidation,
  handleValidationsErrors,
  UserController.login
);

// запрос будет нам говорить авторизованы мы или нет.
// когда прийдет запрос на "/auth/me", checkAuth решит нужно ли дальше выполнять код
// если checkAuth разрешит, то next() перекинет выполнение кода дальше (к (req, res) =>{})
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    // вернем клиенту путь по которому сохранили картинку
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post("/posts",checkAuth, postCreateValidation, handleValidationsErrors, PostController.create);
app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  PostController.update
);

// это express приложение надо запустить, запустить веб-сервер
// пишем на какой порт прикрепить это приложение.
// второй параметр - функция (опционально), в этой функции скажем,
//что если сервер не смог запуститься, то мы вернем сообщение об этом.
// Если сервер запустился, скажем "Скрвер ОК"

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Serrver OK");
});

//node index.js
