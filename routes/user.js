const express = require('express');
const app = express();
// const bcrypt = require('bcrypt');
const User = require('../models/user');


// Insert intro page? 

// Render /user/signup
app.get('/signup', (req, res) => {
        res.render("user/signup");
});

app.post('/signup', (req, res)=>{
      const { username, password } = req.body;
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) next('Hashing error occured.');
        else {
          User.create({
            username: username,
            password: hash,
          })
            .then(newUser => {
              if (newUser.username === '' || newUser.password === '')
                res.send('Invalid credentials! You need to fill username and password.');
              else if (newUser.username === newUser.password)
                res.send('Username and password can not be the same. Please, try again!');
              else {
                req.session.currentUser = newUser;
                res.redirect('/user/signup-confirm');
              }
            })
            .catch(err => {
              res.send('Error, user not created');
            });
        }
      });
})


// Render /user/signup-confirm
app.get('/signup-confirm', (req, res) =>{
    User
        .find()
        .then(user => {
            res.render('user/signup-confirm');
        })
        .catch(err => {
            console.log('Error, something went wrong.');
      });
})


// Render /user/login
app.get('/login', (req, res) =>{
        res.render('user/login');
})

app.post('/login', (req, res) =>{
    User
    .findOne({
      username,
    })
    .then(newUser => {
      if (!newUser) res.redirect('/user/main');
      else {
        bcrypt.compare(password, newUser.password, function(err, correctPassword) {
          if (err) res.redirect('/user/main');
          else if (newUser.username === '' || correctPassword === '')
            res.redirect('/user/main');
          else if (!correctPassword) res.redirect('/user/main');
          else {
            req.session.currentUser = newUser;
            res.render('./user/private', { file_upload: newUser.upload });
          }
        });
      }
    })
    .catch((err) => {
        console.log('Error, something went wrong.');
     })
})


// Render /user/dashboard
app.get('/home', (req, res)=>{
    User.find()
      .then(user => {
        res.render('user/dashboard');
      })
      .catch(err => {
        console.log('Error, something went wrong.');
      });
})


// Render /user/feed
app.get('/feed', (req, res) => {
    User.find()
      .then(user => {
        res.render('user/feed');
      })
      .catch(err => {
        console.log('Error, something went wrong.');
      });
})


//  Render /user/add-friend
app.get('/add-friend', (req, res) => {
  User.find()
    .then(user => {
      res.render('user/add-friend');
    })
    .catch(err => {
      console.log('Error, something went wrong.');
    });
});

// Render /user/logout
// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('user/login');
// })
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