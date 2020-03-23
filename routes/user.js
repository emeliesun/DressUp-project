const express = require('express');
const app = express();
const User = require('../models/user');


// Directs to /user/signup
app.get('/signup', (req, res) => {
    User
    .find({})
    .then()
});


// Directs to /user/signup-confirm

// Directs to /user/login

// Directs to /user/dashboard

// Directs to /user/feed

// Directs to /user/add-friend

// Directs to /user/logout


