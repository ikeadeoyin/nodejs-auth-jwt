require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const {requireAuth, checkUser} = require("./Middleware/authMiddleware");

const port = process.env.PORT || 4000;

const app = express();


// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');


// connect the app to the database
const dbURI = process.env.DATABASE_URL;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port))
    .catch((err) => console.log(err))

// routes
app.get("*", checkUser); 
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies
// app.get("/set-cookies", (req,res)=>{
//     // res.setHeader("Set-Cookie", "newuser=true");
//     res.cookie("newUser", false)
//     res.cookie("isEmployee", true, {maxAge:1000 * 60 * 60  *24, httpOnly:true})
//     res.send("you got the cookie")

// })

// app.get("/read-cookies", (req,res)=>{
//     const cookies = req.cookies;
//     console.log(cookies)
//     res.json(cookies)
   
// })