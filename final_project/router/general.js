const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let fs = require('fs');
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
            return res.status(200).json({message: "User registered. Now you can login"});
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
  const bookCall = new Promise((resolve, reject) => {
    try {
        const bookscalled = fs.readFileSync('router/booksdb.js');
        const bookscalledEdit = bookscalled.slice(20, bookscalled.length-26);
        setTimeout(() => resolve(bookscalledEdit), 600);
    } catch (err) {
        reject(err);
    }
  });

  bookCall.then(
    (bookscalledEdit) => res.status(200).json("Currently held books: "+bookscalledEdit),

    (err) => res.status(404).json("Error books: "+ err)
    );
  //  res.send("Currently held books: "+JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const isbnInc = 1 + Number(ISBN);
  const isbnIncS = isbnInc.toString();

  const isbnCall = new Promise((resolve, reject) => {
    try {
        const bookbyisbn = fs.readFileSync('router/booksdb.js');
        let bookbyisbnEdit = bookbyisbn.slice(20, bookbyisbn.length-26);
        bookbyisbnEdit = bookbyisbnEdit.subarray(bookbyisbnEdit.indexOf(ISBN), bookbyisbnEdit.indexOf(isbnIncS));
        setTimeout(() => resolve(bookbyisbnEdit), 600);
    } catch (err) {
        reject(err);
    }
  });

  isbnCall.then(
    (bookbyisbnEdit) => res.status(200).json("Book by ISBN: "+bookbyisbnEdit),

    (err) => res.status(404).json("Error ISBN: "+ err)
    );
  //res.send(JSON.stringify(books[ISBN], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const Author = req.params.author.replace(/_/g, ' ');

  const authorCall = new Promise((resolve, reject) => {
    try {
        setTimeout(() =>  {
            const bookbyauthorFilter = JSON.stringify(Object.values(books).filter((a) => a.author === Author), null, 4)
            resolve(bookbyauthorFilter), 600
        });  
    } catch (err) {
        reject(err);
    }
  });

  authorCall.then(
    (bookbyauthorFilter) => res.status(200).json("Book by "+Author+": "+bookbyauthorFilter),

    (err) => res.status(404).json("Index failed: Author "+ err)
    );

  /*
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
  */
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const Title = req.params.title.replace(/_/g, ' ');

  const titleCall = new Promise((resolve, reject) => {
    try {
        setTimeout(() =>  {
            const bookbytitleFilter = JSON.stringify(Object.values(books).filter((a) => a.title === Title), null, 4)
            resolve(bookbytitleFilter), 600
        });  
    } catch (err) {
        reject(err);
    }
  });

  titleCall.then(
    (bookbytitleFilter) => res.status(200).json("Book by "+Author+": "+bookbytitleFilter),

    (err) => res.status(404).json("Index failed: Title "+ err)
    );
  /*
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
  */
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
