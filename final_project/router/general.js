const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Destructure the username and password from request body
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(400).json({ message: "Username already exists." });
    }
  
    // Add the new user to the users object
    users[username] = { username, password };
  
    // Send success response
    return res.status(201).json({ message: "User registered successfully!" });
  });
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Get the author's name from the request parameters
    const author = req.params.author.toLowerCase(); // Convert to lowercase to handle case-insensitive search

    // Obtain all keys (ISBNs) of the books
    const bookKeys = Object.keys(books);

    // Array to store books that match the author
    const booksByAuthor = [];

    // Iterate through the books object using the keys (ISBNs)
    for (let isbn of bookKeys) {
        // Check if the author's name matches the author in the current book (case-insensitive comparison)
        if (books[isbn].author.toLowerCase() === author) {
            // If match found, push the book to the booksByAuthor array
            booksByAuthor.push(books[isbn]);
        }
    }

    if (booksByAuthor.length > 0) {
        // If matching books found, return them
        return res.status(200).json(booksByAuthor);
    } else {
        // If no books found for the author
        return res.status(404).json({ message: "No books found by this author" });
    }
});


// Get all books based on title
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Get the title from the request parameters
    const title = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive search

    // Find books that match the title
    const booksByTitle = [];

    // Iterate through the books object and check if the title matches
    for (let isbn in books) {
        if (books[isbn].title.toLowerCase().includes(title)) {  // Check if title contains the search query
            booksByTitle.push(books[isbn]);
        }
    }

    if (booksByTitle.length > 0) {
        // Return the matching books
        return res.status(200).json(booksByTitle);
    } else {
        // If no books found with that title
        return res.status(404).json({ message: "No books found with that title" });
    }
});


//  Get book review
// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get the ISBN from the request parameters

    // Check if the book exists in the books object
    const book = books[isbn];

    if (book) {
        // If the book exists, check if it has reviews
        if (book.reviews && book.reviews.length > 0) {
            // Return the reviews for the book
            return res.status(200).json({ reviews: book.reviews });
        } else {
            // If no reviews are available for the book
            return res.status(404).json({ message: "No reviews available for this book" });
        }
    } else {
        // If the book is not found in the books object
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
