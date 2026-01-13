const express = require("express");
const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");

const mongoose = require("mongoose");

const dbpath="mongodb+srv://root:7499631188@airbnbproject.nvhats3.mongodb.net/ProjectArc?appName=airbnbproject";
const app = express();
port = 3000;

const { homeRouter } = require('./routes/homerouter');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 


app.use(homeRouter);
app.use((req, res, next) => {
    res.status(404).send("<h1>404 page not found</h1>")
})

mongoose.connect(dbpath).then(()=>{
    console.log("connected to mongodb");
     app.listen(port, () => {
        console.log(`Example app listening on port: http://localhost:${port}`);
    });
})
.catch(err=>{
    console.log("failed to connect to mongodb",err);
});