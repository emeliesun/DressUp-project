const express = require('express');
const mongoose = require('mongoose');
// const Outfit = require('../models/outfit');
const app = express();

// Create
app.get("/create", (req, res)=>{
    res.render('item/create')
})

module.exports = app;