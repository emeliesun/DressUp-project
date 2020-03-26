
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
        res.redirect('outfit/list' )
    }).catch((err) => {
        res.send(`Error: ${err}`);
    });
})

module.exports = app;