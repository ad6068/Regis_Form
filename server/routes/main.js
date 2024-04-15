const express = require("express");
const path = require("path");
const router = express.Router();
const Post = require("../models/Post");

router.get("/blog", async (req, res) => {
  try {
    const local = {
      title: "Nodejs blog",
      description: "simple blog created with nodejs, express & mongodb",
    };
    let perpage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perpage * page - perpage)
      .limit(perpage)
      .exec();

    const count = await Post.countDocuments();
    const nextpage = parseInt(page) + 1;
    const hasNextPage = nextpage <= Math.ceil(count / perpage);

    res.render("index", {          
      local,
      data,
      current: page,
      nextpage: hasNextPage ? nextpage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });
    const local = { 
      title: data.title,
      description: "simple blog created with nodejs, express & mongodb",
    };
    res.render("post", { local, data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    const local = {
      title: "search",
      description: "simple blog created with nodejs, express & mongodb",
    };

    let searchterm = req.body.searchterm;
    const searchnospecialchar = searchterm.replace(/[^a-zA-Z0-0]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchnospecialchar, 'i') } },
        { body: { $regex: new RegExp(searchnospecialchar, 'i') } }
    ],
    });
    res.render("search",{
      data,
      local
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get("/login", (req, res) => {
//   try {
//     res.sendFile(__dirname + "/login.html");
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//     console.error(error);
//   }
// });

module.exports = router;

