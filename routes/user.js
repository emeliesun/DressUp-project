const express = require('express');
const app = express();
// const bcrypt = require('bcrypt');
const User = require('../models/user');


// Home
app.get('/home', (req, res) => {
  // debugger
  let userName = req.session.currentUser.username;
  res.render('user/home',{
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
     friends: 1,
     new_reqs:1
    }
   })
   .populate("friend_request")
   .populate("friends")
    .then(feedData => {
      User.findOneAndUpdate({username: userName},{
        new_reqs: false
        })
        .then(theUser => {
          console.log('new feed flag was reset!')
        })
        .catch(err => {
          res.send(`Error: ${err}`);
        });
      res.render('user/feed', {userFeedData:feedData});
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });
});

// Settings
app.get('/user/settings', (req,res)=>{
  let userName = req.session.currentUser.username;
  User.find({
    filter: {
     username: userName
    }
   })
   .then(userData => {
     res.render('user/settings', { user: userData})
   })
   .catch(err => {
    res.send(`Error: ${err}`);
    });
})

// profile
app.get('/user/profile', (req,res)=>{

    let userName = req.session.currentUser.username;
    User.find({
      filter: {
      username: userName
      },
      project: {
        firstname: 1,
        lastname: 1,
        username:1,
        password: 1,
        image: 1
      }
    })
    .then(userData => {
      res.render('user/feed', { user: userData})
    })
    .catch(err => {
      res.send(`Error: ${err}`);
      });
  
})


// Add-friend
app.get('/add-friend', (req, res) => {
    let userName = req.session.currentUser.username;
  User.find({ username: { $ne: userName }})
    .then(usersData => {
      res.render('user/add_friend', {users:usersData});
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });
});

app.get('/add-friend/:id', (req,res)=>{
  debugger
  const friendId = req.params.id;
  let userId = req.session.currentUser._id;
  User.findByIdAndUpdate(friendId,{
    $push: { friend_request: userId } 
    })
    .then(userData => {
      console.log(`request pushed : ${userData.friend_request}`)
      res.json({response: true})
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });

})


// 


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
