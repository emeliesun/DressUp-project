const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Signup
app.get('/signup', (req, res) => {
  res.render('user/signup');
});

app.post('/signup', (req, res, next) => {
  const { firstname, lastname, username, password, password_check } = req.body;
  if (username === '' || password === '') {
    res.render('user/signup', {
      errorMessage: 'Indicate a username and a password to sign up',
    });
    return;
  }
  if (username === password) {
    res.render('user/signup', {
      errorMessage:
        'Username and password can not be the same. Please, try again!',
    });
    return;
  }
  if(password_check !== password){
      res.render ('user/signup', {
          errorMessage: 'Password check failed!',
      })
      return;
  }
  User
  .findOne({ username: username })
  .then(user => {
    if (user !== null) {
      res.render('user/signup', {
        errorMessage:
          'Username already exist. Choose another username!',
      });
      return;
    }
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        res.send(`Hashing error occured.  ${err}`);
      } else {

        User
            .create({
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: hash,
            })
            .then(user => {
                req.session.user = user;
                res.redirect('/user/signup_confirm');
            })
            .catch(err => {
              res.send(`Error, user not created ${err}`);
            });
      }});
    })
    });


// Signup confirm
app.get('/signup_confirm', (req, res) => {
  User
  .find()
    .then(user => {
      res.render('user/signup_confirm');
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });
});

// Login
app.get('/login', (req, res) => {
  res.render('user/login');
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (username === '' || password === ''){
            res.render('user/login', {
                errorMessage: 'Indicate a username and a password to log in',
            });
            return;
        }
  User
    .findOne({
        username
    })
    .then(user => {
      if (!user) {
          res.render('user/login', {
            errorMessage: 'This user does not exist. Click on signup if you want to create it.',
          });
        }
        bcrypt.compare(password, user.password, function(err, correctPassword) {
          if (err) res.render('user/login');
          else if (!correctPassword) res.render('user/login', {
              errorMessage: 'Wrong password. Try again!'
          });
          else {
            req.session.currentUser = user;
            res.redirect('/user/home');
          }
        });
    })
    .catch(err => {
      console.log(`Error, user not logged in ${err}`);
    });
});

// Dashboard
app.get('/home', (req, res) => {
  let userName = req.session.currentUser.username;
  res.render('user/dashboard',{
    welcomeMessage: `Welcome ${userName}`
  })
});

// Feed
app.get('/feed', (req, res) => {
  let userName = req.session.currentUser.username;
  User.find({
    filter: {
     username: userName
    },
    project: {
     username:1,
     friend_request: 1,
     friends: 1
    }
   })
   .populate("friend_request")
   .populate("friends")
    .then(feedData => {
      res.render('user/feed', {userFeedData:feedData});
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });
});

//  Render /user/add-friend
app.get('/add_friend', (req, res) => {
  User.find()
    .then(usersData => {
      res.render('user/add_friend', {users:usersData});
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });
});

//Obs, reminder to self >> need to inser app.use(session)... in app.js to get it to work with logout!

// app.get('/logout', (req, res) => {
//   User.find()
//     .then(user => {
//       res.render('user/logout');
//     })
//     .catch(err => {
//       console.log('Error, something went wrong.');
//     });
// });

module.exports = app;
