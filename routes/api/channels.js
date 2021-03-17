const router = require("express").Router();
const {
  newChannelValidationSchema,
  newMessageValidationSchema,
} = require("../../validation/channels");
const channelModel = require("../../database/model/Channel");

router.post("/new", async (req, res) => {
  const { error } = newChannelValidationSchema.validate(req.body);
  if (error)
    return res.status(400).json({ error: error.details[0]["message"] });

  try {
    const channel = await channelModel.create(req.body);
    return res.status(200).json(channel);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const channels = await channelModel.find({});
    return res.status(200).json(channels);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  if (req.params.id.length !== 24)
    return res.status(400).json({ error: "Invalid channel id" });
  try {
    const channel = await channelModel.findById(req.params.id).exec();
    if (!channel) return res.status(400).json({ error: "Channel not found" });
    return res.status(200).json(channel);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/messages/new", async (req, res) => {
  const { error } = newMessageValidationSchema.validate(req.body);
  if (error)
    return res.status(400).json({ error: error.details[0]["message"] });

  try {
    const channel = await channelModel.findById(req.body.channelid).exec();
    if (!channel) return res.status(400).json({ error: "Channel not found" });
  } catch (err) {
    return res.status(500).json(err);
  }

  try {
    await channelModel.findByIdAndUpdate(req.body.channelid, {
      $push: { messages: { user: req.body.userid, text: req.body.text } },
    });
    return res.status(200).json(req.body);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
