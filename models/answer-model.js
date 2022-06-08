const mongoose = require("mongoose");

const Answer = mongoose.model("Answer", {
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "form",
  },
  answerData: {
    type: Object,
    required: true,
  },
});

module.exports = Answer;
