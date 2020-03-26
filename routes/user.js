const express = require('express');
const app = express();
const User = require('../models/user');
const Outfit = require('../models/outfit');


// Home
app.get('/home', (req, res) => {
  // debugger
  let userName = req.session.currentUser.username;
  let userId = req.session.currentUser._id;
  Outfit.find({
      $and : [
      {shared:true}
      , {owner:{_id:userId}}
      ]
    })
    .populate({path:'owner', populate:{path:'friends'}})
    .then (outfitData => {
      let outfits = outfitData.map((outfit)=> {
        let outfitMapped = outfit;
        outfitMapped.nr_likes = outfit.liked_by.length;
        return outfitMapped;
      })
      outfits.sort((outfitA, outfitB)=> outfitB.nr_likes - outfitA.nr_likes);
      res.render('user/home',{outfit:outfits,username:userName})
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });
    
});

// Feed (friend requests)
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
app.get('/user/account', (req,res)=>{

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
  // debugger
    let userName = req.session.currentUser.username;
    let userId = req.session.currentUser._id;
  User.find(
    {
       $and: [
        {
         username: {
          $ne: userName
         }
        },
        {
         friend_request: {
          $not: {
           $elemMatch: {
            $eq: userId
           }
          }
         }
        }
       ]
     })
    .then(usersData => {
      res.render('user/add_friend', {users:usersData});
    })
    .catch(err => {
      res.send(`Error: ${err}`);
    });
});

app.get('/add-friend/:id', (req,res)=>{
  // debugger
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


// temp route for User Account page
app.get('/account', (req,res)=>{
  //debugger
  let userId = req.session.currentUser._id;
  User.findById(userId)
   .then(userData => {
     console.log(userData)
     res.render('user/account', { user: userData})
   })
   .catch(err => {
    res.send(`Error: ${err}`);
    });
})

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect("/index");
});

module.exports = app;
