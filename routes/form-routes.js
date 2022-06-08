const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const urlSlug = require("url-slug");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

const Form = require("../models/form-model");

mongoose.connect(process.env.MONGOOSE_URI);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/* Send all forms or messages*/
router.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    if (forms.length === 0) {
      return res.json({ message: "Form is empty" });
    }
    res.json(forms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

router.get("/form/:slug", async (req, res) => {
  try {
    console.log('req.params.slug', req.params.slug);
    const forms = await Form.find({slug: req.params.slug});
    console.log('forms', forms);
    if (forms.length === 0) {
      return res.status(404).json({ message: "no form matches" });
    }
    res.json(forms[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error" });
  }
});


/* Creating a new form. */
router.post("/form/create", async (req, res) => {
  try {
    console.log("req.fields", req.fields);
    console.log("req.files", req.files);

    const newForm = new Form({});

    if (!req.fields.title) {
      return res.status(400).json({ message: "Missing title" });
    }
    if (req.fields.title.length < 6) {
      return res.status(400).json({
        message: "Title is shorter than the minimum allowed length (6)",
      });
    }

    newForm.title = req.fields.title;
    const slug = urlSlug.convert(req.fields.title, {
      transformer: urlSlug.LOWERCASE_TRANSFORMER,
    });

    const slugExiste = await Form.findOne({ slug: slug });
    if (slugExiste !== null) {
      return res.status(400).json({ message: "Slug already exists" });
    }
    newForm.slug = slug;

    if (req.files.picture) {
      const pictureToUpload = await cloudinary.uploader.upload(
        req.files.picture.path
      );
      newForm.picture = pictureToUpload.secure_url;
    }

    newForm.elements = req.fields.question;

    await newForm.save();

    res.json({ message: "Form Create" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

/* Update a form by its id */
router.put("/form/update/:_id", async (req, res) => {
  try {
    const formToUpdate = await Form.findById(req.params._id);
    const formNewData = {};
    console.log("req.fields", req.fields);

    if (req.fields.title) {
      formToUpdate.title = req.fields.title;
    }
    if (req.fields.slug) {
      return res.status(400).json({ message: "Slug not editable" });
    }

    if (req.files.picture && req.files.picture !== "") {
      const pictureToUpload = await cloudinary.uploader.upload(
        req.files.picture.path
      );
      formToUpdate.picture = pictureToUpload.secure_url;
    }

    if (req.fields.elementsType && req.fields.elementsType !== "") {
      formToUpdate.elements[0].elementsType = req.fields.elementsType;
    }
    if (req.fields.elementsValue && req.fields.elementsValue !== "") {
      formToUpdate.elements[0].elementsValue = req.fields.elementsValue;
    }

    // const formUpdate = await Form.findByIdAndUpdate(req.params._id, formNewData, {new : true});

    await formToUpdate.save();

    return res.json(formToUpdate.elements[0]);
    // return res.json({ message: "/backoffice/update/:id" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

/* Delete a form by its id */
router.delete("/form/delete/:_id", async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    return res.json({ message: "Delete Form" });
    // return res.json({ message: "/backoffice/delete/:id" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error to delete form" });
  }
});

module.exports = router;
