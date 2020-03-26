
const express = require('express');
const app = express();
const User          = require('../models/user');
const Outfit        = require('../models/outfit');
const Item          = require('../models/item');
const multer        = require('multer');
var upload          = multer({ dest: 'public/images/' });


// Create
app.get("/create", (req, res)=>{
    res.render('item/create')
})

app.post('/create', upload.single('item-img'), (req,res)=>{
    debugger
    let userId = req.session.currentUser._id;
    Item.create({
        title: req.body.title,
        image: req.file.filename,
        material: req.body.material,
        brand: req.body.brand,
        owner: userId
    })
    .then((itemData) => {
        console.log(itemData)
        res.redirect('/item/list' )
    })
    .catch((err) => {
        res.send(`Error: ${err}`);
    });
})

// Show All (list)
app.get("/list", (req, res)=>{
    debugger
    let userId = req.session.currentUser._id;
    Item.find({owner:userId})
        .then(itemsData => {
            res.render('item/list',{itemsListData: itemsData})
        })
        .catch((err) => {
            res.send(`Error: ${err}`);
        });
    
})

// Show One (detail)
app.get('/detail/:id', (req, res)=> {
    let itemId = req.params.id;
    Item.findById(itemId)
        .then(itemData => {
            res.render('item/detail', {item:itemData})
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })
})

// Update
app.get('/update/:id', (req, res)=>{
    Item
        .findById(req.params.id)
            .then((itemData)=>{
                // console.log(itemData)
                res.render('item/update', {item:itemData})
            })
})

app.post('/update', upload.single('item-img') , (req, res)=>{
    debugger
    let itemId = req.body.id
    if (!req.file) {
        Item.findByIdAndUpdate(itemId, {
            title:      req.body.title, 
            material:   req.body.material,
            brand:      req.body.brand,
        })
        .then((itemData)=>{
            console.log("Updated: ", itemData)
            res.redirect(`/item/detail/${itemData._id}`)
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })    
    } else { 
        Item.findByIdAndUpdate(itemId, {
            title:      req.body.title,
            image:      req.file.filename, 
            material:   req.body.material,
            brand:      req.body.brand,
        })
        .then((itemData)=>{
            console.log("Updated: ", itemData)
            res.redirect(`/item/detail/${itemData._id}`)
        })
        .catch((err)=> {
            res.send(`Error: ${err}`);
        })
    }    
})





module.exports = app;