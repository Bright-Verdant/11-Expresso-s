const express = require("express");
const path = require("path");
const fs = require('fs');
const { v4: uuid } = require('uuid');

const PORT = process.env.PORT || 3002;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.get('/notes', (req, res) => {
    console.log(`${req.method} request received`);
    res.sendFile(path.join(__dirname, '/public/notes.html'))  
});


app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      
      });
});


app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received`);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading file');
        }
      
        const newNote = JSON.parse(data);
    
       
        const id = uuid();
        newNote.push({id, ...req.body});
    
        
        fs.writeFile('./db/db.json', JSON.stringify(newNote), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error writing file');
          }
          
          res.send('Data written successfully');
        });
      });
});


app.delete('/api/notes/:id', (req, res) => {
  
  
  deleteNote(id)
    .then(() => {
      
      res.status(200).send('Note deleted successfully');
    })
    .catch((err) => {
      
      res.status(500).send('Error deleting note');
    });
});


// const deleteNoteFromDatabase = async (id) => {
//   try {
//     await fetch(`/api/notes/${id}`, {
//       method: 'DELETE',
//     });
//     // Success! Reload the page to reflect the changes
//     location.reload();
//   } catch (err) {
//     console.error(`Failed to delete note with ID ${id}:`, err);
//   }
// };



app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);