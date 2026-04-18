const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

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

// Get all books using async/await
public_users.get('/', async (req, res) => {
  try {
    const bookList = await new Promise((resolve) => resolve(books));
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject({ message: 'Book not found' });
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json(err));
});

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(b => b.author === author);
    if (result.length > 0) resolve(result);
    else reject({ message: 'No books found for this author' });
  })
  .then(result => res.status(200).json(result))
  .catch(err => res.status(404).json(err));
});

// Get book details based on title using Promise callbacks
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(b => b.title === title);
    if (result.length > 0) resolve(result);
    else reject({ message: 'No books found with this title' });
  })
  .then(result => res.status(200).json(result))
  .catch(err => res.status(404).json(err));
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: 'Book not found' });
});

module.exports.general = public_users;