const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps:{
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
);

module.exports = model("user", userSchema);
