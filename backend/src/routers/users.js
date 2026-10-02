import express from "express";
import { User } from "../models/User.js";
import { userValidationRules, userUpdateRules, validate } from "../middleware/validators.js";

const router = express.Router();

router.post("/", userValidationRules(), validate, async (req, res) => {
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email уже занят" });
    }
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "email"],
  });
  res.json(users);
});

router.put("/:id", userUpdateRules(), validate, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    await user.update(req.body);
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });

  await user.destroy();
  res.status(204).send();
});

export default router;