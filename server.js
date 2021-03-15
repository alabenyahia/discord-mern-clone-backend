const express = require("express");
const app = express();
require("./database/connection");

app.use(express.json());

app.listen(5000, () => console.log("Server running on port 5000"));
