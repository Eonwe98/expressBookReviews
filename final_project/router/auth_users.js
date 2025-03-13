const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
    "username":"TestUser",
    "password":"12345"
    }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  //Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    }  else { return false; }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
    } else { return res.status(208).json({ message: "Invalid Login. Check username and password" }); }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const Review = req.body.review;
    const ISBN = req.params.isbn;
    const username = req.session.username;
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                if (books[ISBN]) {
                    books[ISBN].reviews[username] = Review;
                    res.status(200).json({ message: "Review updated successfully. Reviews: "+ books[ISBN].reviews });
                } else {
                    res.status(404).json({ message: "No Book found" });
                }
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Delete book review
  const ISBN = req.params.isbn;
  // Check if user is logged in and has valid access token
  if (req.session.authorization) {
      let token = req.session.authorization['accessToken'];
      // Verify JWT token
      jwt.verify(token, "access", (err, user) => {
          if (!err) {
              if (books[ISBN]) {
                  delete books[ISBN].reviews[user];
                  res.status(200).json({ message: "Review Deleted. Reviews: "+ books[ISBN].reviews });
              } else {
                  res.status(404).json({ message: "No Book found" });
              }
          } else {
              return res.status(403).json({ message: "User not authenticated" });
          }
      });
  } else {
      return res.status(403).json({ message: "User not logged in" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
