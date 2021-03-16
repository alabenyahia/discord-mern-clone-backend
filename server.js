const express = require("express");
const app = express();
require("./database/connection");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/user", require("./routes/api/auth"));
app.listen(5000, () => console.log("Server running on port 5000"));
