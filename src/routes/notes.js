const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

//Route  for receiving data
//there is express valiadtor module to validate fields
//Add  notes
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    //console.log(req.body);
    const {title, description } = req.body; 
    const errors = [];
    if (!title) {
        errors.push({text: 'Please write a title'});
    }
    if (!description) {
        errors.push({text: 'Please write a description'});
    }
    
    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    }else {
        const newNote = new Note({title, description});
        //console.log(newNote);
        newNote.user = req.user.id;
        await newNote.save() //save in the database
        req.flash('success_msg', 'Note Added Successfully'); //accessing the global variable
        res.redirect('/notes'); //Redirect a new view
        //res.send('ok');
    }
    
});

//View notes
router.get('/notes', isAuthenticated, async (req, res) =>{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', {notes});
    //res.send('Notes from database');
});

//Update 
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id) //find for id
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) =>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description}); //Find for id
    req.flash('success_msg', 'Notes Updated Successfully');
    res.redirect('/notes');
})

//Delete notes
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
    //console.log(req.params.id);
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Notes Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;



