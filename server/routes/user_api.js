/* --------------- Express Router Module ------------- */
const express = require('express');
const jwt = require('jsonwebtoken');		// for JWT
const config = require('../config.json');	// secret string for JWT
const crypto = require('crypto');			// for Password hashing

const router = express.Router();			// Express Router 	
const mongoose = require('mongoose');		// MongoDB handler
const {check, validationResult} = require('express-validator/check');

let User = require('../mongodb/User');
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
router.post('/login', 
    [
      check('username', 'User name must be between 5 and 10 characters')
        .isLength({ min:4, max:10}),
      check('password', 'Password must be between 4 and 24 characters')
        .isLength({ min:4, max:24})
    ], 
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } 

    var username = req.body.username;
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
    		/* Create a JWT token with custom permissions data */   
        console.log("user.roles:" + user.roles);  
        var member = false;
        var admin = false;
        var permissions = [];
        user.roles.forEach(role => {
          if (role.name === "member") {
            permissions.push("role:member");
            member = true;
          } else if (role.name === "admin") {
            permissions.push("role:admin");
            admin = true;
          }
        });
        console.log("permissions:" + permissions);
        const token = jwt.sign(
          { sub: username,
            permissions: permissions,
          }, config.secret);

        /* Format Authenticated User record */
        var auth = {
          username: username,
          token : token,
          isAuthenticated : true,
          emailAddress : user.emailAddress,
          mobileNumber : user.mobileNumber,
          member : member,
          admin : admin
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
router.post('/add', 
  [
    guard.check([['role:admin']]),
    check('username', 'User name must be between 5 and 10 characters')
        .isLength({ min:4, max:10}),
    check('password', 'Password must be between 4 and 24 characters')
        .isLength({ min:4, max:24}),
    check('mobileNumber','Invalid Australian mobile number')
        .isMobilePhone('en-AU'),
    check('emailAddress','Invalid email address format')
        .isEmail()
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
router.put('/update/:username', 
  [
    guard.check([['role:admin'],['role:member']]),
    check('salt', 'cannot be updated')
        .isEmpty(),
    check('passwordHash', 'cannot be updated')
        .isEmpty(),
    check('mobileNumber','Invalid Australian mobile number')
        .isMobilePhone('en-AU'),
    check('emailAddress','Invalid email address format')
        .isEmail()
  ],(req, res) => { 
 
  console.log("update " +  req.params.username);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }

  var adminUser = false;
  req.user.permissions.forEach(permission => {
    if (permission === "role:admin") {
      adminUser = true;
    }
  });

  /* Only admin user or this (authenticated) user can update */
  if (!adminUser && req.user.sub != req.params.username) {
    return res.status(401).send("User is not authenticated");
  }
  
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

// Password Reset ******************
router.put('/passwordreset/:username', 
[
  guard.check([['role:admin'],['role:member']]),
  check('password', 'Password must be between 4 and 24 characters')
        .isLength({ min:4, max:24})
], (req, res) => {

  /* Exit if validation errors */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }

  var adminUser = false;
  req.user.permissions.forEach(permission => {
    if (permission === "role:admin") {
      adminUser = true;
    }
  });

  if (!adminUser && req.user.sub != req.params.username) {
    return res.status(401).send("User is not authenticated");
  }
 
  /* Find the user record */
  User.findOne(
    {username : req.params.username})
    .then(user => {
      if (user) {
        /* Generate new salt and hash */
        var userData = sha512(req.body.password,generateSalt(12));
        console.log("salt=" + userData.salt);
        console.log("passwordHash=" + userData.passwordHash); 
        user.salt = userData.salt;
        user.passwordHash = userData.passwordHash;
        user.save()
        .then(user => {
            res.status(200).json({'user': 'user password reset successfully'});
        })
      } else {
          res.status(404).send("User not found");
      }
    })
    .catch(err => {
      console.log(err);
    res.status(400).send("unable to update database");
    });
});

// Delete User *********************************
router.delete('/delete/:username', 
  [
    guard.check([['role:admin']])
  ], (req, res) => {

  User.findByIdAndRemove(
    req.params.username)
  .then(() => {
    res.status(200).send("Delete successful");
  })
  .catch(err => {
    console.log(err);
    res.status(400).send("unable to delete user");
  });
});

// List users **************************
router.get('/list', guard.check([['role:admin']]), (req, res) => {
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

module.exports = router;