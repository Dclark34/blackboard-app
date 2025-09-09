const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');

const PORT = process.env.PORT;



//DATABASE IMPORT
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('Connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name} `);
});



// IMPORT MODELS HERE:

const Classroom = require('./models/classroom.js');



//MIDDLEWARE HERE:
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));




//adding styling? Review this from rockit or fruit apps.



//ALL ROUTES BELOW:


//LANDING PAGE (eventually signin will go here) (GET)
app.get('/blackboard', async (req, res) => {
    res.render("landing.ejs");
});


//INDEX PAGE (GET, List of ClassRooms)
app.get('/blackboard/classrooms', async (req, res) => {
    const allClasses = await Classroom.find();
    res.render('index.ejs', { classrooms: allClasses });
});


//CREATE a NEW CLASS (GET):
app.get('/blackboard/classrooms/new', async (req, res) => {
 res.render('newclass.ejs');
});

//CREAT A NEW CLASS (POST)
app.post('/blackboard/classrooms', async (req, res) => {
    const newClass = await Classroom.create(req.body);
    console.log(newClass);
    res.redirect('/blackboard/classrooms');
});


//EDIT CLASSES (GET):
app.get('/blackboard/classrooms/:classroomId/edit', async (req, res) => {
    res.send('This is classroom id');
});



//SERVER LISTENER:

app.listen(PORT, () => {
 console.log(`Listening on Port ${PORT}`)
});