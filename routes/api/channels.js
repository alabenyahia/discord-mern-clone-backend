const router = require("express").Router();
const newChannelValidationSchema = require("../../validation/channels");
const channelModel = require("../../database/model/Channel");

router.post("/new", async (req, res) => {
  const { error } = newChannelValidationSchema.validate(req.body);
  if (error)
    return res.status(400).json({ error: error.details[0]["message"] });

  try {
    const channel = await channelModel.create(req.body);
    return res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/all", (req, res) => {});

module.exports = router;
