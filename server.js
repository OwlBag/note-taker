const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
// npm package used for generating unique ids
const { nanoid } = require('nanoid');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

let notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.post('/api/notes', (req, res) => {
    req.body.id = nanoid();
    const note = createNote(req.body, notes);

    res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
    res.send(deleteNote(req.params.id, notes))
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})

// Creates a note with the given content and updates the database with the new note
function createNote(body, notesArray) {
    console.log(body)
    const note = body;
    notesArray.push(note);
    updateDb(notesArray);

    return note;
}

// Handles the deleting of notes
function deleteNote(id, notesArray) {
    // Returns true if a note with the given id is found
    filtered = notesArray.some(note => note.id === id)
    // If a note was found, filters the notesArray to exclude notes with the given id, and updates the database
    if (filtered){
        notesArray = notesArray.filter(note => note.id !== id)
        updateDb(notesArray);
        return(`Successfully deleted note with id of ${id}`)
    } else {
        return('Could not find a note with that id')
    }
    
    
}

// Updates the db.json file and updates the notes variable to reflect the change
function updateDb(notesArray) {
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    notes = notesArray
}