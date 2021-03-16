const router = require("express").Router();
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../../validation/auth");

const userModel = require("../../database/model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { error } = registerValidationSchema.validate(req.body);
  if (error)
    return res.status(400).json({ error: error.details[0]["message"] });
  const usernameIsNotUnique = await userModel.findOne({
    username: req.body.username,
  });
  if (usernameIsNotUnique)
    return res.status(400).json({ error: "Username already exists" });

  const emailIsNotUnique = await userModel.findOne({
    email: req.body.email,
  });
  if (emailIsNotUnique)
    return res.status(400).json({ error: "Email already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);

  try {
    const user = await userModel.create({ ...req.body, password: hashedPwd });
    return res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidationSchema.validate(req.body);
  if (error)
    return res.status(400).json({ error: error.details[0]["message"] });

  const user = await userModel.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).json({ error: "Email doesn't exists" });

  const pwdIsValid = await bcrypt.compare(req.body.password, user.password);
  if (!pwdIsValid)
    return res.status(400).json({ error: "Password is invalid" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET
  );
  res.header("auth-token", token).status(200).json(token);
});

module.exports = router;
