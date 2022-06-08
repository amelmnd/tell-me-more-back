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

const mongodb = require("mongodb").MongoClient;
const Json2csvParser = require("json2csv").Parser;
const path = require("path");
const fs = require("fs");
// let url = "mongodb://username:password@localhost:27017/";
let url = "mongodb://localhost:27017/";

router.get("/answers/dowloadCsv/:id", async (req, res) => {
  const date = Date.now();

  mongodb.connect(
    process.env.MONGOOSE_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) throw err;
      client
        .db("tellMeMore")
        .collection("answers")
        .find({})
        .toArray((err, data) => {
          if (err) throw err;

          const filesData = [];

          for (let index = 0; index < data.length; index++) {
            if (data[index].formId == req.params.id) {
              filesData.push(data[index].answerData);
            }
          }

          const json2csvParser = new Json2csvParser({ header: true });
          const csvData = json2csvParser.parse(filesData);
          const filePath = path.join(
            __dirname,
            "..",
            "public",
            `answer-${req.params.id}-${date}.csv`
          );

          fs.writeFile(filePath, csvData, function (error) {
            if (error) throw error;
            console.log("Write to bezkoder_mongodb_fs.csv successfully!");
          });

          res.download(filePath, `answer-${req.params.id}-${date}.csv`);
          client.close();
        });
      // res.json({ message: "Write to bezkoder_mongodb_fs.csv successfully!" });
    }
  );
});

module.exports = router;
