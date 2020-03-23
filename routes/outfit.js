const express = require('express');
const mongoose = require('mongoose');
const Outfit = require('../models/outfit');
const app = express();

// Create
app.get("/create", (req, res)=>{
    res.render('item/create')
})

app.post("/create", (req,res)=>{
    Outfit.create({
        title: req.body.title,
        image: req.body.image,
        occasion: req.body.occasion,
        items: [],
        // liked_by: [] ,
        shared: false,
    })
    .then((outfitData)=>{
        console.log("created: ", outfitData)
        res.redirect(`/outfit/detail/${outfitData._id}`);
    })
    .catch((err)=> {
        res.send(err);
    })
})

// List all
app.get("/list", (req, res)=>{
    Outfit
        .find()
        .populate("items")
        .populate("liked_by")
        .then((outfitListData)=>{
            console.log("the list", outfitListData)
            res.render('outfit/list', {listdata: outfitListData})
        })
        .catch((err)=> {
            res.send(err);
        })
})

// Show one
app.get("/detail/:id", (req, res)=>{
    Outfit.findById(req.params.id)
        .populate("items")
        .populate("liked_by")
        .then((outfitData)=>{
            console.log("Detail of: ", outfitData)
            res.render('outfit/detail')
        })
        .catch((err)=> {
            res.send(err);
        })
})

// Update
app.get('/update/:id', (req, res)=>{
    Outfit
        .find()
        .populate("items")
        .populate("liked_by")
        .then((outfitData)=>{
            res.render('outfit/update', {outfitDataVar:outfitData})
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
        res.send(err);
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



