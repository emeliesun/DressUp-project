const express = require('express');
const mongoose = require('mongoose');
const Outfit = require('../models/outfit');
const app = express();
const User = require('../models/user');

// Create
app.get("/create", (req, res)=>{
    res.render('outfit/create')
    
})

app.post("/create", (req,res)=>{
    Outfit.create({
        title: req.body.title,
        image: req.body.image,
        occasion: req.body.occasion,
        description: req.body.description,
        //items: [],
        // liked_by: [] ,
        shared: false,
    })
    .then((outfitData)=>{
        console.log("created: ", outfitData)
        res.redirect(`/outfit/detail/${outfitData._id}`);
    })
    .catch((err)=> {
        res.send(`Error: ${err}`);
    })
})

// List all
// app.get("/list", (req, res)=>{
//     Outfit
//         .find()
//         .populate("items")
//         .populate("liked_by")
//         .then((outfitListData)=>{
//             console.log("the list", outfitListData)
//             res.render('outfit/list', {listdata: outfitListData})
//         })
        // .catch((err)=> {
        //     res.send(`Error: ${err}`);
        // })
// })

app.get('/list', (req,res)=>{
    debugger
    let userName = req.session.currentUser.username;
    User.find({
      filter: {
       username: userName
      },
      project: {
       username:1,
       outfits: 1
      }
     })
      .populate("outfits")
      .then(outfitData => {
        console.log("the list", outfitData)
        res.render('outfit/list', {listdata: outfitData, username:userName})
      })
      .catch((err)=> {
        res.send(`Error: ${err}`);
    })
      
  })

// Show fitting room (shared outfits)
app.get("/fitting-room", (req, res)=>{
    Outfit.find({shared:true})
        .populate("items")
        .populate("liked_by")
        .then((outfitsData)=>{
            console.log("fitting room list: ", outfitsData)
            res.render('outfit/fitting_room', {sharedList: outfitsData})
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })
})

// Show one
app.get("/detail/:id", (req, res)=>{
    Outfit.findById(req.params.id)
        .populate("items")
        .populate("liked_by")
        .then((outfitData)=>{
            console.log("Detail of: ", outfitData)
            res.render('outfit/detail', {outfit: outfitData})
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })
})

// Share
app.get('/share/:id', (req,res)=>{
    Outfit.findByIdAndUpdate(req.params.id, {
        shared: true
    })
    .then((outfitData)=>{
        console.log("Shared: ", outfitData)
        res.redirect(`/outfit/detail/${outfitData._id}`)
    })
    .catch((err)=> {
        res.send(`Error: ${err}`);
    })    
})

// Unshare
app.get('/unshare/:id', (req,res)=>{
    Outfit.findByIdAndUpdate(req.params.id, {
        shared: false
    })
    .then((outfitData)=>{
        console.log("Shared: ", outfitData)
        res.redirect(`/outfit/detail/${outfitData._id}`)
    })
    .catch((err)=> {
        res.send(`Error: ${err}`);
    })    
})

// Update
app.get('/update/:id', (req, res)=>{
    Outfit
        .findById(req.params.id)
        .populate("items")
        .populate("liked_by")
        .then((outfitData)=>{
            // console.log(outfitData)
            res.render('outfit/update', {outfit:outfitData})
        })
} )

app.post('/update/:id',   /*upload.single('recipe-img') ,*/ (req, res)=>{
    Outfit.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        image: req.params.image, // should change to API 
        occasion:req.params.occasion,
        items: req.params.items,
        liked_by: req.params.likedBy,
        shared: req.params.shared
    })
    .then((outfitData)=>{
        console.log("Updated: ", outfitData)
        res.redirect(`/detail/${outfitData._id}`)
    })
    .catch((err)=> {
        res.send(`Error: ${err}`);
    })    
})

// // Delete
// app.get('/delete/:id', (req, res)=>{
//     Outfit
//         .findByIdAndDelete(req.params.id)
//         .then((outfit)=>{
//             console.log("deleted: ", outfit)
//             res.redirect('')
//         })
// })


module.exports = app;
