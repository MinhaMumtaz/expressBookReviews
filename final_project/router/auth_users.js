const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken };
    
    return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;
    
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }
    
    // Add or update the review
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({ 
        message: "Review added/modified successfully",
        book: books[isbn]
    });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }
    
    delete books[isbn].reviews[username];
    
    return res.status(200).json({ 
        message: "Review deleted successfully",
        book: books[isbn]
    });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
