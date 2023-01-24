const express = require("express");
const connection = require("./config/db");

const app = express();

connection();

app.get("/health",(req,res) => {
    res.send(`Up and running at ${new Date()}`);
});



const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3001";

app.listen(port,(req,res) => {
    console.log(`Server started at http://${host}:${port}`);
})