const mongoose = require("mongoose");

const Answer = mongoose.model("Answer", {
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
  },
  answerData: {
    type: Object,
    required: true,
  },
});

module.exports = Answer;
