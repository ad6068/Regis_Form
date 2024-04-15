const express = require("express");
const router = express.Router();
const path = require("path");
const Login = require("../models/Login");

router.get("/login", (req, res) => {
  const local = {
    title: "login page",
    description: "this is login page",
  };
  res.render("layouts/login", { local });
});

router.post("/login", async (req, res) => {
  try {
    const { username_login, password_login, email_login } = req.body;
    const newUser = new Login({
      username_login,
      password_login,
      email_login
    });
    await newUser.save();
    res.json({ message: "Successfully stored Data in Databse" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error(error);
  }
});

module.exports = router;
