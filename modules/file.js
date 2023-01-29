const mongoose = require("mongoose");
const {model,Schema} = mongoose;

const fileSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        folder: { type: String, required: true },
        content: {type: String, required: true}
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
);

module.exports = model("file", fileSchema);