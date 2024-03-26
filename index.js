const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser')
const port = 8010;
const app = express();
// const db=require('./config/mongoose')

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://asodariyashyam555:7Gy4HOdaqydt22QM@cluster0.609d2sg.mongodb.net/blogproject',{
    useNewUrlParser : true
})
.then((res)=>{
    console.log("connected to the database")
})
.catch((err)=>{
    console.log(err)
})


const passport=require("passport");
const passportLocal=require("./config/passport_local");
const session=require("express-session");

const connectFlash = require('connect-flash')
const flash=require('./config/connectFlash');
const { request } = require('http');
app.use(connectFlash());

app.use(cookieParser())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname,'assets')))

app.use(express.static(path.join(__dirname,'user-assets')))

app.use(express.urlencoded());

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use(session({
    name:'RNW' ,
    secret: 'shyam',
    resave:true,
    saveUninitialized: true,
    cookie:{
        maxAge:60000*60*100 //1 hour
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)
app.use(flash.setFlash)

app.use('/',require("./routes"))

app.listen(port, (error) => console.log("server running on port : " + port));