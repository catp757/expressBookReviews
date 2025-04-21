const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   // Send JSON response with formatted friends data
//   res.send(JSON.stringify(books,null,4));
// });

// Get the book list available in the shop using axios and promises
// public_users.get('/', (req, res) => {
//   axios.get('http://localhost:5000/books') // NOTE: defined the books endpoint in the index.js file
//     .then(response => {
//       res.send(JSON.stringify(response.data, null, 4));
//     })
//     .catch(error => {
//       res.status(500).json({ message: "Error retrieving books", error: error.message });
//     });
// });

// get the books using axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/books');
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {  
//   // Retrieve the isbn parameter from the request URL and send the corresponding book's details
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
//  });

// get book details based on ISBN using axios and promises
// public_users.get('/isbn/:isbn', (req, res) => {
//   const isbn = req.params.isbn;

//   axios.get(`http://localhost:5000/books/${isbn}`)  // books/isbn endpoint defined in the index.js file
//     .then(response => {
//       res.send(JSON.stringify(response.data, null, 4));
//     })
//     .catch(error => {
//       res.status(404).json({ message: "Book not found", error: error.message });
//     });
// });

// Get book details based on ISBN using axios and async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});


// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;

//   // Convert object values to array
//   const booksArray = Object.values(books);

//   // Filter the array to match the author
//   const filtered_books = booksArray.filter(book => book.author === author);

//   if (filtered_books.length > 0) {
//     res.send(filtered_books);  // Send all books by that author
//   } else {
//      res.status(404).json({ message: "Book by given author is not found" });
//   }
// });

// Get book details based on author using axios and promises
// public_users.get('/author/:author', (req, res) => {
//   const author = req.params.author;

//   axios.get('http://localhost:5000/books')
//     .then(response => {
//       const booksArray = Object.values(response.data);
//       const filteredBooks = booksArray.filter(book => book.author === author);

//       if (filteredBooks.length > 0) {
//         res.send(filteredBooks);
//       } else {
//         res.status(404).json({ message: "Book by given author is not found" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ message: "Error fetching books", error: error.message });
//     });
// });

// Get book details based on author using axios and async/await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const booksArray = Object.values(response.data);
    const filteredBooks = booksArray.filter(book => book.author === author);

    if (filteredBooks.length > 0) {
      res.send(filteredBooks);
    } else {
      res.status(404).json({ message: "Book by given author is not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;

//   // Convert object values to array
//   const booksArray = Object.values(books);

//   // Filter the array to match the title
//   const filtered_books = booksArray.filter(book => book.title === title);

//   if (filtered_books.length > 0) {
//     res.send(filtered_books);  // Send all books by that author
//   } else {
//     res.status(404).json({ message: "Book with given title not found" });
//   }
// });

// Get all books based on title using axios and promises
// public_users.get('/title/:title', (req, res) => {
//   const title = req.params.title;

//   axios.get('http://localhost:5000/books')
//     .then(response => {
//       const booksArray = Object.values(response.data);
//       const filteredBooks = booksArray.filter(book => book.title === title);

//       if (filteredBooks.length > 0) {
//         res.send(filteredBooks);
//       } else {
//         res.status(404).json({ message: "Book with given title not found" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ message: "Error retrieving books", error: error.message });
//     });
// });

// Get all books based on title using axios and async/await
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const booksArray = Object.values(response.data);
    const filteredBooks = booksArray.filter(book => book.title === title);

    if (filteredBooks.length > 0) {
      res.send(filteredBooks);
    } else {
      res.status(404).json({ message: "Book with given title not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book's review
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
