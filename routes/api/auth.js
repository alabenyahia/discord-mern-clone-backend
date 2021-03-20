const router = require("express").Router();
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../../validation/auth");

const userModel = require("../../database/model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const usr = await userModel.findById(req.user.id);
    return res.status(200).json({
      user: {
        id: usr.id,
        email: usr.email,
        username: usr.username,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/register", async (req, res) => {
  const { error } = registerValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let errObj = {};
    error.details.forEach(
      (er) => (errObj = { ...errObj, [er.context.label]: er.message })
    );
    return res.status(400).json({ registerValidationError: errObj });
  }

  const emailIsNotUnique = await userModel.findOne({
    email: req.body.email,
  });
  if (emailIsNotUnique)
    return res
      .status(400)
      .json({ registerValidationError: { email: "Email already exists" } });

  const usernameIsNotUnique = await userModel.findOne({
    username: req.body.username,
  });
  if (usernameIsNotUnique)
    return res.status(400).json({
      registerValidationError: { username: "Username already exists" },
    });

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);

  try {
    const user = await userModel.create({ ...req.body, password: hashedPwd });
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let errObj = {};
    error.details.forEach(
      (er) => (errObj = { ...errObj, [er.context.label]: er.message })
    );
    return res.status(400).json({ loginValidationError: errObj });
  }

  let user = null;
  try {
    user = await userModel.findOne({
      email: req.body.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }

  if (!user)
    return res
      .status(400)
      .json({ loginValidationError: { email: "Email doesn't exists" } });

  const pwdIsValid = await bcrypt.compare(req.body.password, user.password);
  if (!pwdIsValid)
    return res
      .status(400)
      .json({ loginValidationError: { password: "Password is invalid" } });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET
  );
  res.status(200).json({
    user: { id: user.id, email: user.email, username: user.username },
    token,
  });
});

module.exports = router;
