require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes")
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
app.use(express.urlencoded( { extended: true } ))
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(session({
  secret:'geeksforgeeks',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use('/', routes);

app.set("view engine", "ejs")

//MongoDB connection
const mongoose = require('mongoose');


const mongoURL = 'mongodb+srv://'+ process.env.MongoDBUser +':' + process.env.MongoDBPassword +'@cluster0.jl3vvyk.mongodb.net/companies_db?&retryWrites=true&w=majority';

mongoose.connect(mongoURL, { useNewUrlParser: true , useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = 3000;
 
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});