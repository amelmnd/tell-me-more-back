const mongoose = require("mongoose");

const Form = mongoose.model("Form", {
  title: {
    type: String,
    required: true,
    minLength: 6,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  picture: String,
  color: {
    primary: String,
    secondary: String,
    text: String,
  },
  elements: [
    {
      elements_id: Number,
      elementsType: String,
      elementsValue: String,
    },
  ],
});

module.exports = Form;
