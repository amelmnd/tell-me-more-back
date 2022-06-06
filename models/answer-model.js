const mongoose = require("mongoose");

module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema(
    {
      formId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "form",
      },
      answerData: {
        type: Array,
        required: true,
      },
    },
    {
      timestamps: false,
    }
  );
  return mongoose.model("answer", schema, "answer");
};
