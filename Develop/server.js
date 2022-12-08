const express = require('express');
const path = require('path');
const {
  //readFromFile,
  readAndAppend,
  //writeToFile,
} = require('../helpers/fsUtils');


const PORT = process.env.port || 3001;
const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);
//DELETE Route for a specific note
app.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});
app.post('/api/notes', (req, res) => {
  console.log(req.body);
    const {id, title, text} = req.body;
    if (req.body) {
      const postNote = {
        id,
        title,
        text, 
      };
      readAndAppend(postNote, './db/db.json');

     } else {
        res.error('Error in adding note');
      }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
