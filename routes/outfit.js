const express       = require('express');
const mongoose      = require('mongoose');
const Outfit        = require('../models/outfit');
const app           = express();
const User          = require('../models/user');
const multer        = require('multer');
var upload          = multer({ dest: 'public/images/' });

// Create
app.get("/create", (req, res)=>{
    res.render('outfit/create')
    
})


app.post("/create", upload.single('outfit-img'),(req,res)=>{
    let userId = req.session.currentUser._id
    Outfit.create({
        title: req.body.title,
        image: req.body.image,
        occasion: req.body.occasion,
        description: req.body.description,
        image: req.file.filename,
        owner: userId,
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

// Outfit List
app.get('/list', (req,res)=>{
    // debugger
    let userId = req.session.currentUser._id;
    Outfit.find({owner:userId})
      .populate("items")
      .then(outfitData => {
        console.log("the list", outfitData)
        res.render('outfit/list', {outfitListdata: outfitData, userid:userId})
      })
      .catch((err)=> {
        res.send(`Error: ${err}`);
    })
      
  })

// Show fitting room (shared outfits)
app.get("/fitting-room", (req, res)=>{  
    let userId = req.session.currentUser._id;
    Outfit.find({
        $and:[
            {owner: userId},
            {shared:true}
        ]})
        .populate("owner")
        .populate("items")
        .populate("liked_by")
        .then((outfitsData)=>{
            let outfits = outfitsData.map((outfit)=> {
                let outfitMapped = outfit;
                outfitMapped.nr_likes = outfit.liked_by.length;
                return outfitMapped;
            })

            outfits.sort((outfitA, outfitB)=> outfitB.nr_likes - outfitA.nr_likes);
            console.log("fitting room list: ", outfits)
            res.render('outfit/fitting_room', {sharedList: outfits})
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })
})

// Show feed
app.get('/feed/:id', (req,res)=>{
    Outfit.findById(req.params.id)
        .populate("liked_by")
        // .populate("items")
        // .populate("owner")
        .then(outfitData => {
            res.render('outfit/outfit_feed', {outfit:outfitData})
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
app.get('/share/:id', (req,res)=>{  // move this to axios!
    Outfit.findByIdAndUpdate(req.params.id, {
        shared: true
    })
    .then((outfitData)=>{
        console.log("Shared: ", outfitData)
        res.redirect(`/outfit/feed/${outfitData._id}`)
    })
    .catch((err)=> {
        res.send(`Error: ${err}`);
    })    
})

// Unshare
app.get('/unshare/:id', (req,res)=>{  // move this to axios!
    Outfit.findByIdAndUpdate(req.params.id, {
        shared: false
    })
    .then((outfitData)=>{
        console.log("Shared: ", outfitData)
        res.redirect(`/outfit/feed/${outfitData._id}`)
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
            .catch((err)=> {
                res.send(`Error: ${err}`);
            })  
} )

app.post('/update',   upload.single('outfit-img') , (req, res)=>{
    // debugger
    let outfitId = req.body.id
    if (!req.file) {
        Outfit.findByIdAndUpdate(outfitId, {
            title:      req.body.title,
            occasion:   req.body.occasion,
            description:req.body.description,
        })
        .then((outfitData)=>{
            console.log("Updated: ", outfitData)
            res.redirect(`/outfit/detail/${outfitData._id}`)
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })  
    } else {
        Outfit.findByIdAndUpdate(outfitId, {
        title:      req.body.title,
        image:      req.file.filename, 
        occasion:   req.body.occasion,
        description:req.body.description,
        })
        .then((outfitData)=>{
            console.log("Updated: ", outfitData)
            res.redirect(`/outfit/detail/${outfitData._id}`)
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })
    }
        
})

// Delete
app.get('/delete/:id', (req, res)=>{
    Outfit
        .findByIdAndDelete(req.params.id)
        .then((outfit)=>{
            console.log("deleted: ", outfit)
            res.redirect('/outfit/list')
        })
})


module.exports = app;
