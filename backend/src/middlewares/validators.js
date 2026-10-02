import { body, validationResult } from "express-validator";

export const userValidationRules = () => [
  body("email")
    .isEmail().withMessage("Некорректный email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Пароль минимум 6 символов")
    .isString().withMessage("Пароль должен быть строкой"),
];

export const userUpdateRules = () => [
  body("email")
    .optional()
    .isEmail().withMessage("Некорректный email")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 }).withMessage("Пароль минимум 6 символов"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};