const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ username, password });
  return res.status(200).json({ message: 'User successfully registered. Now you can login' });
});

// Task 1: Get all books using async-await with Axios
public_users.get('/', async (req, res) => {
  try {
    // Using promise to resolve the books object
    const bookList = await new Promise((resolve, reject) => {
      if (books) resolve(books);
      else reject(new Error('No books found'));
    });
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 2: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  // Using Promise to find book by ISBN
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject(new Error('Book not found'));
  })
  .then(book => {
    // Successfully found book - return it
    return res.status(200).json(book);
  })
  .catch(err => {
    // Book not found - return error
    return res.status(404).json({ message: err.message });
  });
});

// Task 3: Get book details based on Author using Promise callbacks
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  // Using Promise to filter books by author
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) resolve(booksByAuthor);
    else reject(new Error('No books found for this author'));
  })
  .then(result => {
    // Successfully found books by author
    return res.status(200).json(result);
  })
  .catch(err => {
    // No books found for author
    return res.status(404).json({ message: err.message });
  });
});

// Task 4: Get book details based on Title using Promise callbacks
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  // Using Promise to filter books by title
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) resolve(booksByTitle);
    else reject(new Error('No books found with this title'));
  })
  .then(result => {
    // Successfully found books by title
    return res.status(200).json(result);
  })
  .catch(err => {
    // No books found with title
    return res.status(404).json({ message: err.message });
  });
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  // Check if book exists and return its reviews
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: 'Book not found' });
});

module.exports.general = public_users;