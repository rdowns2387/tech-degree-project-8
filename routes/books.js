// Require Express
const express = require('express');
// Express Router
const router = express.Router();

// Database
const db = require('../db');
const { Book } = db.models;

let books;

// Router
router.get('/', (req, res) => {

	(async () => {
	  try {
	  	books = await Book.findAll();
	 		res.render('books', {books});
	  } catch (error) {
	    console.error('Error connecting to the database: ', error);
	  }
	})();
});

// Export
module.exports = router;
