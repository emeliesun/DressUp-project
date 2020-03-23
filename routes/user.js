const express = require('express');
const app = express();
const User = require('../models/user');


// Directs from /user/signup to /user/signup-confirm
app.get('/signup', (req, res) => {
    User
    .find()
    .then((user) =>{
        res.render("user/signup-confirm");
    })
    .catch((err) => {
        console.log("Error, something went wrong.");
    })
});


// Directs from /user/signup-confirm to /user/login
app.get('/signup-confirm', (req, res) =>{
    User
        .find()
        .then(user => {
            res.render('user/login');
        })
        .catch(err => {
            console.log('Error, something went wrong.');
      });
})


// Directs from /user/login to /user/dashboard
app.get('/login', (req, res) =>{
    User.find()
      .then(user => {
        res.render('user/dashboard');
      })
      .catch(err => {
        console.log('Error, something went wrong.');
      });
})


// Directs from /user/dashboard

// Directs from /user/feed

// Directs from /user/add-friend

// Directs from /user/logout


module.exports = app;