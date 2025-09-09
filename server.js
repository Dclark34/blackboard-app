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
    res.render('classrooms/index.ejs', { classrooms: allClasses });
});


//CREATE a NEW CLASS (GET):
app.get('/blackboard/classrooms/new', async (req, res) => {
 res.render('classrooms/newclass.ejs');
});

//CREAT A NEW CLASS (POST)
app.post('/blackboard/classrooms', async (req, res) => {
    const newClass = await Classroom.create(req.body);
    console.log(newClass);
    res.redirect('/blackboard/classrooms');
});


//NEED A SHOW PAGE FOR EACH CLASSROOM TO SHOW THE STUDENTS (GET)
app.get('/blackboard/classrooms/:classroomId', async (req, res) => {
    const classroom = await Classroom.findById(req.params.classroomId);
    res.render('students/studentindex.ejs', {classroom: classroom})
});


//UPDATE CLASS INFO (GET):
app.get('/blackboard/classrooms/:classroomId/edit', async (req, res) => {
    const classroom = await Classroom.findById(req.params.classroomId);
    res.render("classrooms/edit.ejs", {classroom: classroom});
});

//UPDATE CLASS INFO (PUT)

app.put('/blackboard/classrooms/:classroomId', async (req, res) => {
    await Classroom.findByIdAndUpdate(req.params.classroomId, req.body);
    res.redirect(`/blackboard/classrooms/${req.params.classroomId}`)
});


//DELETE A CLASSROOM

app.delete('/blackboard/classrooms/:classroomId', async (req, res) => {
    await Classroom.findByIdAndDelete(req.params.classroomId);
    res.redirect('/blackboard/classrooms');
});


//STUDENT INDEX (GET FORM)

app.get('/blackboard/classrooms/:classroomId/newstudent', async (req,res) => {
    const classroom = await Classroom.findById(req.params.classroomId);
    res.render('students/newstudent.ejs', {classroom: classroom})
});

//CREATE NEW STUDENT (POST)
app.post('/blackboard/classrooms/:classroomId', async (req, res) => {
    try {
    const currentClass = await Classroom.findById(req.params.classroomId);
    const newStudent = currentClass.students.push(req.body);
    console.log(req.body);
    await currentClass.save();
    // console.log(newStudent);
    res.redirect(`/blackboard/classrooms/${req.params.classroomId}`);
    } catch (error) {
        console.log(error);
        res.redirect(`/blackboard/classrooms/${req.params.classroomId}`);
    }
});














//SERVER LISTENER:

app.listen(PORT, () => {
 console.log(`Listening on Port ${PORT}`)
});