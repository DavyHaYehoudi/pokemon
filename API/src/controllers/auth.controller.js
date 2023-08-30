const { User } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../errors/customError");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new AuthenticationError("Bad username or password", 0);
    }
    const user = await User.findOne({ where: { username: username } });
    if (user === null) {
      throw new AuthenticationError("This account does not exist", 1);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError("Wrong password", 2);
    }
    const message = "L'utilisateur a été connecté avec succès";
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.PRIVATE_KEY,
      { expiresIn: "24h" }
    );
    res.json({ message, data: user, token });
  } catch (error) {
    next(error);
  }
};
module.exports.signUp = async (req, res, next) => {
  let { username, password } = req.body;
  try {
    password = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUND)
    );
    const user = await User.create({ username, password });
    const message = "New user successfully created !";
    res.status(201).json({ message, data: user });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, error });
    }
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: error.message, error });
    }
    next(error);
  }
};
