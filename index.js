// Hi, I am Jay the author of this code. I am currently building the clone for QUORA using my knowledge of programming in JS and NEW JS programming Languages..

const express = require("express");
const app = express();
const port = 8080;
const path = require("path"); //THIS LINE IS CRUEIL AS IT WILL NOT ALLOW WORKING FURTHER

// Using Middleware for Encoding Json Data
app.use(express.urlencoded({extended: true}));

// I am setting a viewEngine to EJS
app.set("view engine", "ejs");

// I am setting a view directory for EJS
app.set("views", path.join(__dirname, "views"));

// Now i am setting a static file dir for express
app.use(express.static(path.join(__dirname,"public")));

// Below is our database array with username and content so that later we can use this to update and delete the post 
let posts = [
    {
        id: 1,
        username: "Jay",
        content: "This is my first post on Quora"
    },
    {
        id: 2,
        username: "Aman",
        content: "This is my second post on Quora"
    },
    {
        id: 3,
        username: "Shardha",
        content: "This is my third post on Quora"
    },
    {
        id: 4,
        username: "Adam",
        content: "This is my fourth post on Quora"
    },
    {
        id: 5,
        username: "Eve",
        content: "This is my fifth post on Quora"
    }
];

// Checking whether our server is working properly, with GET request

app.get("/posts", (req, res)=>{
    //res.send("Hi Jay, Your server is running fine with all GET Reqs and updated arrays.");
    res.render("index.ejs",{posts});
});

// Creating a POST request for creating new post using posts/new

app.get("/posts/new",(req, res)=>{
    res.render("new.ejs");
});

// This will be the code for a POST request create by ournew postpage , it will take res and return the request body

app.post("/posts",(req, res)=>{
    res.send("POST request working in Progress");
let {username, content} = req.body;
    // Now we are adding a new post to our posts array
    posts.push({
        id: posts.length + 1,
        username,
        content
    });
    // After adding new post, we are redirecting the user to our main page
   // res.redirect("/posts");
})

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});