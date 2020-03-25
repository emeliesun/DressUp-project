const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');

app.get("/index", (req, res)=>{
    res.render('intro')
})

// Signup
app.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  app.post('/signup', (req, res, next) => {
    const { firstname, lastname, username, password, password_check } = req.body;
    if (username === '' || password === '') {
      res.render('signup', {
        errorMessage: 'Indicate a username and a password to sign up',
      });
      return;
    }
    if (username === password) {
      res.render('signup', {
        errorMessage:
          'Username and password can not be the same. Please, try again!',
      });
      return;
    }
    if(password_check !== password){
        res.render ('signup', {
            errorMessage: 'Password check failed!',
        })
        return;
    }
    User
    .findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render('signup', {
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
                  res.redirect('/signup_confirm');
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
    res.render('signup_confirm');
    })
    .catch(err => {
    res.send(`Error: ${err}`);
    });
});


// Login
app.get('/login', (req, res) => {
    res.render('login');
  });
  
app.post('/login', (req, res) => {
// debugger
    const {username, password} = req.body;
    if (username === '' || password === ''){
            res.render('login', {
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
        res.render('login', {
            errorMessage: 'This user does not exist. Click on signup if you want to create it.',
        });
        }
        bcrypt.compare(password, user.password, function(err, correctPassword) {
        if (err) res.render('login');
        else if (!correctPassword) res.render('login', {
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
  

module.exports = app;

