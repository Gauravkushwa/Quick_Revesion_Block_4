const { doesNotMatch } = require('assert');
const express = require('express');
const fs = require('fs');

const server = express();
server.use(express.json());

const readDB = () => fs.readFileSync('db.json', 'utf-8');
const writeDB = (data) => fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

server.get('/books', (req, res) =>{
    const data = JSON.parse(readDB());
    res.status(200).send(data.books);
});

// Get Auther by ID;

server.get("/books/:id", (req, res) =>{
    const data = JSON.parse(readDB());
    const book =  data.books.find(u => u.id === parseInt(req.params.id));
    if(!book) return res.status(404).json({"msg" : 'ID not found'})
        res.status(200).send(book);

});

// Add New Auther;
server.post("/books", (req, res) => {
    const data = JSON.parse(readDB());
    const newAuther = {
        id: Date.now(),
        ...req.body
    }
    data.books.push(newAuther);
    writeDB(data);
    res.status(201).json({"msg" : "Auther Created Successfully..!", newAuther})

});

// Update User By ID;

server.put('/books/:id', (req, res) =>{
    const data = JSON.parse(readDB());
    var index = data.books.findIndex(u => u.id === parseInt(req.params.id));
    if(index.length !== -1){
        data.books[index] = {...data.books[index], ...req.body}
    }
    writeDB(data);
    res.status(200).send(data.books[index]);
})

// Delete Auther by ID;

server.delete('/books/:id', (req, res) =>{
    const data = JSON.parse(readDB());
    const deletedId = data.books.filter(u => u.id !== parseInt(req.params.id));
    if(deletedId.length !== data.books.length){
        data.books = deletedId;
        writeDB(data)
        res.status(202).json({'MSG' : `the Auther of ${req.params.id} id Deleted succussfully...!`})
    }else{
        res.status(404).json({'MSG' : 'invailed Auther ID'})
    }
});

// Add Search Functionlity by Author;

server.get("/books/search", (req, res) => {
    const db = JSON.parse(readDB());
    const author = req.query.author;

    if(!author)return res.status(400).json({"MSG" : 'Author Query parameter Required..!'});

    const results = db.books.filter(book =>
        book.author.toLowerCase().includes(author.toLowerCase())
    )
    if (results.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
      }
    
      res.status(200).json(results);
})

// This Route for others
server.use((req, res) =>{
    res.json({"MSG" : "Route Not Found...!"})
})

server.listen(8000, () => {
    console.log(`server is running on http://localhost:8000`);
})