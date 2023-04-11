import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

// вынесем сюда те функции, которые мы делали в запросах

export const register = async (req, res) => {
  try {
    // // должны проверить есть ли ошибки в нашем запросе
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json(errors.array());
    // }

    const password = req.body.password;
    // алгоритм шифрования пароля
    const salt = await bcrypt.genSalt(10);
    // зашифрованный пароль
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    // создаем пользователя в MongoDB
    const user = await doc.save();
    // создаем токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      // ключ благодаря которому мы зашифруем токен
      "secret123",
      // 3й параметр - время сколько будет жить наш токен
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    // вернем информацию о пользователе и токен
    // ВАЖНО!!! в express можно возвращать только один ответ.
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    // нужно найти в БД пользователя
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    // если пользователь есть в БД, то надо проверить совпадает ли пароль
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    // если пароль неправильный
    if (!isValidPassword) {
      return res.status(404).json({
        message: "Неверный пароль",
      });
    }

    // Если пользователь нашелся и пароль корректный, то значит он смог авторизоваться
    const token = jwt.sign(
      {
        _id: user._id,
      },
      // ключ благодаря которому мы зашифруем токен
      "secret123",
      // 3й параметр - время сколько будет жить наш токен
      {
        expiresIn: "30d",
      }
    );

    // вытаскиваем информацию о пользователе
    const { passwordHash, ...userData } = user._doc;

    // вернем информацию о пользователе и токен
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "нет такого пользователя",
      });
    }

    // вытаскиваем информацию о пользователе
    const { passwordHash, ...userData } = user._doc;

    // вернем информацию о пользователе и токен
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "нет доступа",
    });
  }
};
