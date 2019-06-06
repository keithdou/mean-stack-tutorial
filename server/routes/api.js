/* --------------- Express Router Module ------------- */
const express = require('express');
const jwt = require('jsonwebtoken');		// for JWT
const config = require('../config.json');	// secret string for JWT
const crypto = require('crypto');			// for Password hashing

const router = express.Router();			// Express Router 	
const mongoose = require('mongoose');		// MongoDB handler
const {check, validationResult} = require('express-validator/check');

let User = require('../mongodb/User');
let Book = require('../mongodb/Book');
let guard = require('express-jwt-permissions')();

/* Generate Salt (for new users only) */
var generateSalt = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
  .toString('hex')    /** convert to hexadecimal format */
  .slice(0,length);   /** return required number of characters */
};

/* Generate hash for password + salt */
var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

// ------------------- Public (unprotected) Methods -----------------------
router.post('/login', (req, res) => {

 var username = req.body.userName;
	var password = req.body.password;

	//console.log("username,password=" + username + "," + password);

	User.findOne(
		{"username" : username}
   )
  .then((user) => {
    if (user) {
      var hash = sha512(password,user.salt);
  		//console.log("hash=" + hash.passwordHash);
  		//console.log("userRec=" + user.passwordHash);
  		if (hash.passwordHash != user.passwordHash) {
  			return res.status(401).json({ message: 'Invalid password' });
  		}
  		/* Create a JWT token */
  		var permissions = [];
      if (user.canQuery) {
        permissions.push("user:read");
      }
      if (user.canUpdate) {
        permissions.push("user:write");
      }
      if (user.adminUser) {
        permissions.push("admin");
      }
      
      const token = jwt.sign(
        { sub: username,
          permissions: permissions }, 
          config.secret);

  		/* Format Authenticated User record */
  		var auth = {
  			userName: username,
  			token: token,
  			isAuthenticated: true,
  			adminUser: user.adminUser,
  			canUpdate: user.canUpdate,
  			canQuery: user.canQuery
  		};
      res.send(auth);
    } else {
       return res.status(401).json({ message: 'Invalid username' });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(400).send("unable to get user from database");
  });
});

// -----Protected Methods -- JWT required in Header (see Server.js) ---------------->

// Create user ***********************
router.post('/users/add', 
  [
    guard.check([['admin']]),
    check('adminUser', 'admin must be true or false')
        .isBoolean()
  ], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }  

	var password = req.body.password;
	
	var userData = sha512(password,generateSalt(12));
	console.log("salt=" + userData.salt);
	console.log("passwordHash=" + userData.passwordHash); 

	let user = new User(req.body);
	user.salt = userData.salt
	user.passwordHash = userData.passwordHash;

	user.save()
    .then(book => {
     res.status(200).json({'user': 'user added successfully'});
    })
    .catch(err => {
     res.status(400).send("unable to save to database");
    });
});

// Update existing user ******************
router.put('/users/update/:username', guard.check([['admin']]), (req, res) => { 
 
  console.log("update " +  req.params.username);
  
  User.findOneAndUpdate(
                  {username : req.params.username},
                  req.body,
                  {new: true})
  .then(user => {
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  })
  .catch(err => {
    res.status(400).send("unable to update database");
  });
});

// List users **************************
router.get('/users/list', guard.check([['admin']]), (req, res) => {
 User.find({},{"__v" : 0})
 .sort('username')
 .then(userList => {
    if (userList) {
      res.send(userList);
    } else {
      res.status(404).send("No users found");
    }
  })
  .catch(err => {
    console.log(err);
    res.status(400).send("unable to list users");
  });
});

// Add a new book ******************
router.post('/books/add', (req, res) => {
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
router.put('/books/update/:bookid', (req, res) => {

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
router.get('/books/find/:bookid', (req, res) => {
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
router.delete('/books/delete/:bookid', (req, res) => {

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
router.get('/books/list', (req, res) => {
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

module.exports = router;