// Hi, I am Jay the author of this code. I am currently building the clone for QUORA using my knowledge of programming in JS and NEW JS programming Languages..

const express = require("express");
const app = express();
const port = 8080;
const path = require("path"); //THIS LINE IS CRUEIL AS IT WILL NOT ALLOW WORKING FURTHER
const { v4: uuidv4 } = require("uuid"); //THIS LINE IS IMP FOR USING UUID IN OUR CODE
const methodOverride = require("method-override");

// Using Middleware for Encoding Json Data
app.use(express.urlencoded({ extended: true }));

// Using _method for app.use to set the method for overriding. THIS MEANS TO OVERRIDE THE POST HAVING _DELETE
app.use(methodOverride("_method"));

// I am setting a viewEngine to EJS
app.set("view engine", "ejs");

// I am setting a view directory for EJS
app.set("views", path.join(__dirname, "views"));

// Now i am setting a static file dir for express
app.use(express.static(path.join(__dirname, "public")));

// Below is our database array with username and content so that later we can use this to update and delete the post
let posts = [
  {
    id: uuidv4(),
    username: "Jay",
    content: "This is my first post on Quora",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: uuidv4(),
    username: "Aman",
    content: "This is my second post on Quora",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: uuidv4(),
    username: "Shardha",
    content: "This is my third post on Quora",
  },
  {
    id: uuidv4(),
    username: "Adam",
    content: "This is my fourth post on Quora",
  },
  {
    id: uuidv4(),
    username: "Eve",
    content: "This is my fifth post on Quora",
  },
];

// Checking whether our server is working properly, with GET request

app.get("/posts", (req, res) => {
  //res.send("Hi Jay, Your server is running fine with all GET Reqs and updated arrays.");
  res.render("index.ejs", { posts });
});

// Creating a POST request for creating new post using posts/new

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// This will be the code for a POST request create by ournew postpage , it will take res and return the request body

app.post("/posts", (req, res) => {
  //Now i will also add the ID, and passing it along with the username & content

  // res.send("POST request working in Progress");
  let { username, content } = req.body;
  let id = uuidv4();
  // Now we are adding a new post to our posts array
  posts.push({
    id, //posts.length + 1, //this is a basic way of creating id with incement
    username,
    content,
  });
  // After adding new post, we are redirecting the user to our main page
  res.redirect("/posts");
});

// Now adding a new route
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  // res.send("Request is working");
  // Here we are finding the post in our posts array using find method
  let post = posts.find((p) => id === p.id);
  res.render("show.ejs", { post });
  // res.send("Request is working");
});

// Adding PATCH function to the add a specific path that will be used to edit teh post further.
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => id === p.id); //by this line of code i can know what id i need or i amworking on, now i will simply just add / append the new content ie the updated content to my content
  post.content = newContent;
  console.log(post);
  console.log(newContent);
  console.log(id);

  // After adding new post, we are redirecting the user to our main page
  res.redirect("/posts");
});

// Creatinga new route for EDIT using my DELETE
app.get("/posts/:id/edit", (req, res) => {
  // res.send("Request is working");
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/posts");
});

// Adding a new route for Upvotes
// Route for upvoting a post
app.post("/posts/:id/upvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.upvotes += 1;
  }
  res.redirect("/posts");
});

// Route for downvoting a post
app.post("/posts/:id/downvote", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.downvotes += 1;
  }
  res.redirect("/posts");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
