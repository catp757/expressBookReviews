const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username)=>{  
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter(user => user.username === username);
  return userswithsamename.length > 0;
}

// check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{
  // Filter the users array for any user with the same username and password
  let validusers = users.filter(user => user.username === username && user.password === password);
  return validusers.length > 0;
}

// only registered users can login
regd_users.post("/login", (req,res) => {
    // Extract username and password from request body
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});  // Token expires in 1 hour

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // <-- from query string
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text missing" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (books[isbn]) {
    delete books[isbn].reviews[username]; // Remove the review for the logged-in user
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
