const express = require('express');
const db = require('./db');
const { Book } = db.models;

const app = express();



app.set('view engine', 'pug');

app.use('/static', express.static('public'));

// parse json to use throughout app
app.use(express.json());
app.use (express.urlencoded({extended: false}))

// redirect to books page
app.get('/', (req, res)=>{
  res.redirect('/books');
});

// populate the books page
app.get('/books', (req, res)=>{
  let books;
  (async () => {
    try {
      books = await Book.findAll();
      res.render('books', {books});
    } catch (error) {
      console.error('Error connecting to the database: ', error);
    }
  })();
});



//new books blank form
app.get('/books/new', (req, res)=>{
  res.render('new_book');
});

//post a new book
app.post('/books/new', (req, res) => {
	(async () => {

		// data
		const id = req.params.id;
		const title = req.body.title;
		const author = req.body.author;
		const genre = req.body.genre;
		const year = req.body.year;

		try {
		  	const book = await Book.create({ id, title, author, genre, year })
		 		res.redirect('/');
		  } catch (error) {
		    if(error.name === 'SequelizeValidationError'){
          const errors = error.errors
          res.render('new_book', {errors})
        } else {
          console.error(error)
          error.status = 500;
          error.message = "Something went wrong with the database"
          next(error);
        }
		  }
	})();
});


// Book Details
app.get('/book/:id', (req, res) => {
	(async () => {
    try {
    	const book = await Book.findByPk(req.params.id)
			res.render('book_detail', {book});
    } catch (error) {
    	console.error('Something went wrong with the database', error);
    }
  })();
});

// Post Updated Book content
app.post('/book/:id/', async(req, res, next) => {

  // Book Variables
  const id = req.params.id;
  const title = req.body.title;
  const author = req.body.author;
  const genre = req.body.genre;
  const year = req.body.year;

  try {
    const targetedBook = await Book.findByPk(req.params.id)
    await targetedBook.update(req.body)
    .then(() => {
      res.redirect('/');
  })
  } catch (error) {
    if(error.name === 'SequelizeValidationError'){
      const errors = error.errors
      res.render('new_book', {errors})
    } else {
      console.error(error)
      error.status = 500;
      error.message = "Something went wrong with the database"
      next(error);
    }
  }
});

//delete a book
app.post('/book/:id/delete', async(req, res, next) => {
	try {
		const targetedBook = await Book.findByPk(req.params.id)
		await targetedBook.destroy(req.body)
		.then(() => {
      res.redirect('/');
    })
	} catch (error){
		console.error('There was an error deleting your book.', error);
	}
});

// Errors
  // for page not found

  app.use((req, res, next) => {
  	const err = new Error('Page Not Found');
  	err.status = 404;
  	res.status(404);
  	res.render('not_found');
  });

  // for a book that doesn't exist
  app.use((err, req, res, next) => {
  	console.error(err);
  	res.status(500);
  	res.render('book_not_found');
  });

//run the app!
app.listen(3000, () => {
  console.log('The application is running on localhost:3000');
});
