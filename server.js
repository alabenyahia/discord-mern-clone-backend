const express = require("express");
const app = express();
require("dotenv").config();
require("./database/connection");
const authMidleware = require("./middleware/auth");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/user", require("./routes/api/auth"));
app.use("/api/channels", authMidleware, require("./routes/api/channels"));

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
