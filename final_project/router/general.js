const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (users[username]) {
      return res.status(400).json({ message: "Username already exists." });
    }
  
    users[username] = { username, password };
    return res.status(201).json({ message: "User registered successfully!" });
});

// TASK 10: Get all books (Async/Await)
public_users.get('/', async function (req, res) {
    try {
        const bookList = await new Promise((resolve) => {
            resolve(books);
        });
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// TASK 11: Get book by ISBN (Async/Await)
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        });
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

// TASK 12: Get books by author (Async/Await)
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();
        const booksByAuthor = await new Promise((resolve) => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].author.toLowerCase() === author) {
                    result.push(books[isbn]);
                }
            }
            resolve(result);
        });
        
        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// TASK 13: Get books by title (Async/Await)
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();
        const booksByTitle = await new Promise((resolve) => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase().includes(title)) {
                    result.push(books[isbn]);
                }
            }
            resolve(result);
        });
        
        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No books found with that title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Keep the original synchronous implementation for getting reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        if (book.reviews && Object.keys(book.reviews).length > 0) {
            return res.status(200).json({ reviews: book.reviews });
        } else {
            return res.status(404).json({ message: "No reviews available for this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
