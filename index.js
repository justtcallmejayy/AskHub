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
app.set(express.static(path.join(__dirname,"public")));

// Checking whether our server is working properly, with GET request

app.get("/", (req, res)=>{
    res.send("Hi Jay, Your server is running fine with all GET Reqs")
});
 

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});