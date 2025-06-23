// Hi, I am Jay the author of this code. I am currently building AskHub with SQLite!

const express = require("express");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Home API check
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// Show all posts
app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts", (err, posts) => {
    if (err) return res.status(500).send("Database error");
    res.render("index.ejs", { posts });
  });
});

// Show form to create new post
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// Create a new post
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  const id = require("uuid").v4();
  db.run(
    "INSERT INTO posts (id, username, content, upvotes, downvotes) VALUES (?, ?, ?, 0, 0)",
    [id, username, content],
    (err) => {
      if (err) return res.status(500).send("Insert error");
      res.redirect("/posts");
    }
  );
});

// View post in detail
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM posts WHERE id = ?", [id], (err, post) => {
    if (err) return res.status(500).send("Error fetching post");
    res.render("show.ejs", { post });
  });
});

// Show edit form
app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM posts WHERE id = ?", [id], (err, post) => {
    if (err) return res.status(500).send("Error fetching post for editing");
    res.render("edit.ejs", { post });
  });
});

// Update post
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  db.prepare("UPDATE posts SET content = ? WHERE id = ?").run(content, id);
  res.redirect("/posts");
});

// Delete post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  res.redirect("/posts");
});

// Upvote post
app.post("/posts/:id/upvote", (req, res) => {
  const { id } = req.params;
  db.prepare("UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?").run(id);
  res.redirect("/posts");
});

// Downvote post
app.post("/posts/:id/downvote", (req, res) => {
  const { id } = req.params;
  db.prepare("UPDATE posts SET downvotes = downvotes + 1 WHERE id = ?").run(id);
  res.redirect("/posts");
});

app.get("/about", (req, res) => {
  res.render("static/about", { title: "About AskHub" });
});

app.get("/help", (req, res) => {
  res.render("static/help", { title: "Help | AskHub" });
});

app.get("/privacy", (req, res) => {
  res.render("static/privacy", { title: "Privacy Policy | AskHub" });
});

app.get("/terms", (req, res) => {
  res.render("static/terms", { title: "Terms & Conditions | AskHub" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`AskHub server is running on port ${PORT}`);
});
