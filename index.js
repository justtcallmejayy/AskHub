// Hi, I am Jay the author of this code. I am currently building the clone
// for QUORA using my knowledge of programming in JS and NEW JS programming Languages..

const express = require("express");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const app = express();
const PORT = process.env.PORT || 3000; // Use Render’s port
const fs = require("fs"); // For reading and writing the data file
const path = require("path"); // For handling file paths
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const methodOverride = require("method-override");

// Read the JSON file and parse it into a JavaScript object
const postsPath = path.join(__dirname, "data.json");
let posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));

// Using Middleware for Encoding JSON Data
app.use(express.urlencoded({ extended: true }));

// Using _method for overriding methods like DELETE/PATCH via query string
app.use(methodOverride("_method"));

// Setting the view engine to EJS
app.set("view engine", "ejs");

// Setting the 'views' directory for EJS
app.set("views", path.join(__dirname, "views"));

// Serving static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

/* 
------------------------------------------------
  ADDING A ROUTE FOR ROOT URL
  So when user goes to "/", it redirects to "/posts"
------------------------------------------------
*/
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// Checking whether our server is working properly, with GET request
app.get("/posts", (req, res) => {
  // res.send("Hi Jay, Your server is running fine with all GET Reqs and updated arrays.");
  res.render("index.ejs", { posts });
});

// Creating a GET request to show form for a new post
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// Handling the POST request to create a new post
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  const id = uuidv4();

  // Add a new post to our array
  posts.push({
    id,
    username,
    content,
    upvotes: 0,
    downvotes: 0,
  });

  // Save updated posts array to JSON file (locally)
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));

  // Redirect to main page
  res.redirect("/posts");
});

// Route to show a specific post
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  res.render("show.ejs", { post });
});

// Route to show edit form for a specific post
app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  res.render("edit.ejs", { post });
});

// Handling PATCH to update the content of a specific post
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const newContent = req.body.content;
  const post = posts.find((p) => p.id === id);

  if (post) {
    post.content = newContent;
    // Save to file
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }
  res.redirect("/posts");
});

// Handling DELETE for a specific post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  // Save updated array
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  res.redirect("/posts");
});

// Route for upvoting a post
app.post("/posts/:id/upvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.upvotes = (post.upvotes || 0) + 1;
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }
  res.redirect("/posts");
});

// Route for downvoting a post
app.post("/posts/:id/downvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.downvotes = (post.downvotes || 0) + 1;
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 4));
  }
  res.redirect("/posts");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
