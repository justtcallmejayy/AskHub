// api/index.js
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

// Path to your JSON data file (for local development only)
const postsPath = path.join(__dirname, "..", "data.json");

// For local development, read from data.json; in production, use in-memory array
let posts;
try {
  posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
  if (!Array.isArray(posts)) {
    posts = [];
  }
} catch (error) {
  console.error("Error reading posts file:", error);
  posts = [];
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set EJS & static directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// ---------------------------------------------------
// Add a root route to redirect to /posts
// ---------------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// ---------------------------------------------------
// Routes
// ---------------------------------------------------

// GET /posts - Display all posts
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// GET /posts/new - Form to create a new post
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// POST /posts - Create a new post
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  const id = uuidv4();
  posts.push({ id, username, content, upvotes: 0, downvotes: 0 });

  // If running locally (non-Vercel), write changes to data.json
  if (!process.env.VERCEL) {
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }
  
  res.redirect("/posts");
});

// GET /posts/:id - Display details for a specific post
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  
  if (!post) {
    return res.status(404).send("Post not found");
  }
  
  res.render("show.ejs", { post });
});

// GET /posts/:id/edit - Form to edit a post
app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  
  if (!post) {
    return res.status(404).send("Post not found");
  }
  
  res.render("edit.ejs", { post });
});

// PATCH /posts/:id - Update a specific post
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const newContent = req.body.content;
  const post = posts.find((p) => p.id === id);

  if (post) {
    post.content = newContent;
    if (!process.env.VERCEL) {
      fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
    }
  } else {
    return res.status(404).send("Post not found");
  }
  
  res.redirect("/posts");
});

// DELETE /posts/:id - Delete a specific post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  if (!process.env.VERCEL) {
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }
  res.redirect("/posts");
});

// POST /posts/:id/upvote - Upvote a post
app.post("/posts/:id/upvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);

  if (post) {
    post.upvotes = (post.upvotes || 0) + 1;
    if (!process.env.VERCEL) {
      fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
    }
  } else {
    return res.status(404).send("Post not found");
  }
  
  res.redirect("/posts");
});

// POST /posts/:id/downvote - Downvote a post
app.post("/posts/:id/downvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);

  if (post) {
    post.downvotes = (post.downvotes || 0) + 1;
    if (!process.env.VERCEL) {
      fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
    }
  } else {
    return res.status(404).send("Post not found");
  }
  
  res.redirect("/posts");
});

// ---------------------------------------------------
// IMPORTANT: Export the app for serverless usage (e.g., Vercel)
// ---------------------------------------------------
module.exports = app;
