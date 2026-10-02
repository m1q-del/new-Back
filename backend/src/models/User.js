import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../db/sequelize.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Некорректный email" },
      notEmpty: { msg: "Email обязателен" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Пароль обязателен" },
      len: {
        args: [6, 100],
        msg: "Пароль должен быть от 6 до 100 символов",
      },
    },
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export { User, sequelize };