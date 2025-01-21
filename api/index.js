// api/index.js
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

// Path to your JSON data file
const postsPath = path.join(__dirname, "..", "data.json");
let posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set EJS & static directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// ---------------------------------------------------
//  ADD A ROUTE FOR "/" (ROOT) => Redirect to "/posts"
// ---------------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// ROUTES
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  const id = uuidv4();
  posts.push({ id, username, content, upvotes: 0, downvotes: 0 });

  // Write changes to file (won't persist on Vercel, but works locally)
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));

  res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  res.render("edit.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const newContent = req.body.content;
  const post = posts.find((p) => p.id === id);

  if (post) {
    post.content = newContent;
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }
  res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  res.redirect("/posts");
});

app.post("/posts/:id/upvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);

  if (post) {
    post.upvotes = (post.upvotes || 0) + 1;
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }

  res.redirect("/posts");
});

app.post("/posts/:id/downvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);

  if (post) {
    post.downvotes = (post.downvotes || 0) + 1;
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }

  res.redirect("/posts");
});

// IMPORTANT: Export the app instead of listening
module.exports = app;
