const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    gradeLevel: Number,
    iep: Boolean,
    notes: String,
    gradeAvg: Number,
    assignments: Array,
});

const classroomSchema = new mongoose.Schema({
    className: String,
    students: [studentSchema],
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;