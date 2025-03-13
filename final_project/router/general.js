const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(JSON.stringify(books[ISBN], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const Author = req.params.author.replace(/_/g, ' ');
  let AuthISBN = 0;
  let i = 1;
  let Leng = Object.keys(books).length;

  while ((i<=Leng) && (AuthISBN == 0)) {
    if (books[i].author === Author) {
        AuthISBN = i;
    } else { i++; }
  }

  if (!(AuthISBN == 0)) {
    res.send(JSON.stringify(books[AuthISBN], null, 4));
  } else {
    return res.status(300).json({message: "Index failed: Author"+ Leng});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const Title = req.params.title.replace(/_/g, ' ');
  let AuthISBN = 0;
  let i = 1;
  let Leng = Object.keys(books).length;;

  while ((i<=Leng) && (AuthISBN == 0)) {
    if (books[i].title === Title) {
        AuthISBN = i;
    } else { i++; }
  }

  if (!(AuthISBN == 0)) {
    res.send(JSON.stringify(books[AuthISBN], null, 4));
  } else {
    return res.status(300).json({message: "Index failed: Title "});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const Reviews = books[ISBN].reviews;

  if (!(Reviews == null)) {
    res.send(JSON.stringify(Reviews, null, 4));
  } else { return res.status(300).json({message: "Index failed: Reviews"}); }
});

module.exports.general = public_users;
