const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const mongoose = require("mongoose");

const Answer = require("../models/answer-model");

mongoose.connect(process.env.MONGOOSE_URI);

router.get("/answers/:formId", async (req, res) => {
  try {
    console.log("req.params.formId", req.params.formId);

    const answers = await Answer.find({ formId: req.params.formId }).populate(
      "formId"
    );
    console.log("answers", answers);

    res.json(answers);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error" });
  }
});

router.post("/answer/create", async (req, res) => {
  try {
    const newAnswer = new Answer(req.fields);
    await newAnswer.save();

    res.json({ message: "Answer Create" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error" });
  }
});

// router.delete("/answers/:id")
// router.delete("/answer/:id")

router.delete("/answer/delete/:_id", async (req, res) => {
  try {
    const answerDeleted = await Answer.findByIdAndDelete(req.params._id);
    if (!answerDeleted) {
      return res.status(404).json({ message: "Answer not found" });
    }
    return res.json({ message: "Delete Answer" });
    // return res.json({ message: "/backoffice/delete/:id" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error to delete Answer" });
  }
});

router.delete("/answers/delete/:_id", async (req, res) => {
  try {
    const answersDeleted = await Answer.deleteMany({ formId: req.params._id });
    res.json({
      message: `${answersDeleted.deletedCount} answers successfully deleted`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
