const express = require("express");
const cors = require("cors");

// Student resource routes
const studentGet = require("./Resources/Student/get");
const studentPost = require("./Resources/Student/post");
const studentPatch = require("./Resources/Student/patch");
const studentDelete = require("./Resources/Student/delete");
const { thisServerPort } = require("./config");

const app = express();

// Middlewares setup
app.use((req, res, next) => {
  console.log(`${req.method} ---> ${req.originalUrl}`);
  next();
});

app.use(cors());

// Serve static files from the "public" directory
app.use(express.static("public"));

// registering the routes
app.use("/students", studentGet);
app.use("/students", studentPost);
app.use("/students", studentPatch);
app.use("/students", studentDelete);

// Starting the server (Commented when testing)
const environment = process.env.NODE_ENV;
if (environment === "DEV" || environment === "PROD") {
  app.listen(thisServerPort, () => {
    console.log(`Server is running at http://localhost:${thisServerPort}`);
  });
}

module.exports = app;
