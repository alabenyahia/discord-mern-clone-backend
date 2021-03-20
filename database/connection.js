const mongoose = require("mongoose");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database error ", err));

mongoose.connection.once("open", () => {
  //need mongodb replica set
  const changeStream = mongoose.connection.collection("channels").watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusher.trigger("channels", "new-channel", { change });
    } else if (change.operationType === "update") {
      pusher.trigger("channels", "new-message", { change });
    } else {
      console.log("Pusher error");
    }
  });
});
