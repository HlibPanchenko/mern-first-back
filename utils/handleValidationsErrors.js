import { validationResult } from "express-validator";

export default (req, res, next) => {
	 // должны проверить есть ли ошибки в нашем запросе
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
	 // если ошибок нету, идем далее
	 next()
}