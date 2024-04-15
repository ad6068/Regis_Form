const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const port = process.env.port || 3000;
const connectDB = require("./server/config/conn.js");
require("dotenv").config();

const app = express();
const expresslayout = require("express-ejs-layouts");
const methodoverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodoverride("_method"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: 86400000 },
    // 1 minute: 60000 (60 seconds * 1000 milliseconds)
    // 30 minutes: 1800000 (30 minutes * 60 seconds * 1000 milliseconds)
    // 2 hours: 7200000 (2 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  })
);
app.use(express.static("public"));
app.use(expresslayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main.js"));
app.use("/", require("./server/routes/admin.js"));
app.use("/", require("./server/routes/project.js"));
app.use("/", require("./server/routes/Login.js"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
