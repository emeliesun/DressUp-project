const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const Outfit = require('./models/outfit');
const Item = require('./models/item');
const bodyParser = require('body-parser');
const multer = require('multer');
var upload = multer({ dest: 'public/' });

// Handlebars, Statics, body parser
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Partials
hbs.registerPartials(__dirname + '/views/partials');

// Database connection
mongoose
  .connect('mongodb+srv://overlord:OVERLORD@main-efpuk.azure.mongodb.net/dressup?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(x =>
    console.log(`Connected to Mongo Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));

// Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'));
app.use('/outfit', require('./routes/outfit'));
app.use('/item', require('./routes/item'));

// Function defenitions

// Listener
app.listen(3002, () => {
  console.log('Webserver is listening on port 3002');
});
