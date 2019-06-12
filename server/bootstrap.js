/* Creates the initial Admin user */

const mongoose = require('mongoose');
const config = require('./mongodb/DB');
const crypto = require('crypto');

let User = require('./mongodb/User');

// DB Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

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

var username = "admin";
var password = "admin";

User.findOne(
        {"username" : username}
   )
  .then((user) => {
    if (user) {
        console.log("User " + username + " already exists");
    } else {        
        var userData = sha512(password,generateSalt(12));
        console.log("salt=" + userData.salt);
        console.log("passwordHash=" + userData.passwordHash); 

        let user = new User({username : username});
        user.salt = userData.salt
        user.passwordHash = userData.passwordHash;
        user.emailAddress="adminZZZ@mailinator.com";
        user.mobileNumber="0409123456";
        user.roles=["admin","member"];
        user.save()
        .then(book => {
         console.log('user ' + username + ' added successfully');
        })
        .catch(err => {
         console.log("unable to save to database:" + err);
        });
    }
});

        
