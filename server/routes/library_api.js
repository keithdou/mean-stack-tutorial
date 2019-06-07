/* --------------- Express Router Module ------------- */
const express = require('express');

const libraryRouter = express.Router();     // Express Router   
const mongoose = require('mongoose');   // MongoDB handler

const {check, validationResult} = require('express-validator/check');

let Book = require('../mongodb/Book');
let guard = require('express-jwt-permissions')();

// -----Protected Methods -- JWT required in Header (see Server.js) ---------------->

// Add a new book ******************
libraryRouter.post('/books/add', (req, res) => {
  let book = new Book(req.body);
  book.save()
  .then(book => {
    res.status(200).json({'book': 'book added successfully'});
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  });
});

// Update existing book ******************
libraryRouter.put('/books/update/:bookid', (req, res) => {

  Book.findByIdAndUpdate(
  	req.params.bookid,
  	req.body,
  	{new: true})
  .then(book => {
    if (book) {
      res.send(book);
    } else {
      res.status(404).send("Book not found");
    }
  })
  .catch(err => {
    res.status(400).send("unable to update database");
  });
});

// Get existing book ******************
libraryRouter.get('/books/find/:bookid', (req, res) => {
  Book.findById(
  	req.params.bookid)
  .then((book) => {
    if (book) {
      res.send(book);
    } else {
      res.status(404).send("Book not found");
    }
  })
  .catch(err => {
   console.log(err);
   res.status(400).send("unable to get book from database");
  });
});

// Delete book ******************
libraryRouter.delete('/books/delete/:bookid', (req, res) => {

  Book.findByIdAndRemove(
  	req.params.bookid)
  .then(() => {
    res.status(200).send("Delete successful");
  })
  .catch(err => {
    console.log(err);
    res.status(400).send("unable to delete book");
  });
});

// List books **************************
libraryRouter.get('/books/list', (req, res) => {
 Book.find({},{"__v" : 0})
 .sort('title')
 .then(bookList => {
    if (bookList) {
      res.send(bookList);
    } else {
      res.status(404).send("No books found");
    }
  })
  .catch(err => {
    console.log(err);
    res.status(400).send("unable to list books");
  });
});

module.exports = libraryRouter;