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

// Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
  try {
    const bookList = await new Promise((resolve) => resolve(books));
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject(new Error('Book not found'));
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.author === author);
      if (result.length > 0) resolve(result);
      else reject(new Error('No books found for this author'));
    });
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.title === title);
      if (result.length > 0) resolve(result);
      else reject(new Error('No books found with this title'));
    });
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
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