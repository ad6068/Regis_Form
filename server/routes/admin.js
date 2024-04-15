const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const project = require("../models/project");

const adminlayout = "../views/layouts/admin";
const projectlayout = "../views/layouts/project";
const jwtSecret = process.env.JWT_SECRET;

const middleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userid = decoded.userid;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

router.get("/admin", async (req, res) => {
  try {
    const local = {
      title: "Admin",
      description: "This Page is Handled by Admin",
    };
    res.render("admin/index", { local, layout: adminlayout });
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error(error);
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Username is incorrect" });
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ userid: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
  }
});

router.post("/admin_project", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Username is incorrect" });
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ userid: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard-project");
  } catch (error) {
    console.error(error);
  }
});

router.get("/dashboard-project", middleware, async (req, res) => {
  try {
    const local = {
      title: "This is a project page",
      description: "Project Description",
    };
    const data = await Post.find();
    res.render("project/dashboard-project", { local, data, layout: projectlayout });
  } catch (error) {}
});

router.get("/dashboard", middleware, async (req, res) => {
  try {
    const local = {
      title: "Dashboard Title",
      description: "Dashboard Description",
    };
    const data = await Post.find();
    res.render("admin/dashboard", { local, data, layout: adminlayout });
  } catch (error) {}
});

router.get("/add-project", async (req, res) => {
  try {
    const local = {
      title: "Add Project",
      description: "Dashboard Description",
    };
    const data = await project.findById();
    res.render("project/add-project", { local, data, layout: projectlayout });
  } catch (error) {}
});

router.post("/add-project", async (req, res) => {
  try {
    const { Project_title, Project_body } = req.body;
    const newPost = new project({
      Project_title,
      Project_body,
    });
    await newPost.save();
    console.log(req.body);
    res.redirect("/dashboard-project");
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-post", middleware, async (req, res) => {
  try {
    const local = {
      title: "Add Post",
      description: "Dashboard Description",
    };
    const data = await Post.find();
    res.render("admin/add-post", { local, data, layout: projectlayout });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-post", middleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    const newPost = new Post({
      title,
      body,
    });
    await newPost.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit-post/:id", middleware, async (req, res) => {
  try {
    const local = {
      title: "Add Post",
      description: "Dashboard Description",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("admin/edit-post", {
      data,
      local,
      layout: adminlayout,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit-post/:id", middleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit-project/:id", middleware, async (req, res) => {
  try {
    const local = {
      title: "Add Post",
      description: "Dashboard Description",
    };
    const data = await project.findById({ _id: req.params.id });
    res.render("project/edit-project", {
      data,
      local,
      layout: projectlayout
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit-project/:id", middleware, async (req, res) => {
  try {
    await project.findByIdAndUpdate(req.params.id, {
      Project_title: req.body.title,
      Project_body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/edit-project/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-post/:id", middleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-project/:id", middleware, async (req, res) => {
  try {
    await project.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard-project");
  } catch (error) {
    console.log(error);
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (req.body.username === "yash" && req.body.password === "yash") {
      //   res.redirect("/blog");
      res.send("you are logged in...");
    } else {
      res.send("username and passowrd are wrong");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error(error);
  }
});

router.get("/Logout", (req, res) => {
  res.clearCookie("token");
  // res.json({ message: "logout Successfull" });
  res.redirect("blog");
});

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashpassword = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password: hashpassword });
//       res.status(201).json({ message: "user created", user });
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: "there's an error" });
//       }
//       res.status(500).json({ message: "internal server error" });
//     }
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//     console.error(error);
//   }
// });

module.exports = router;
