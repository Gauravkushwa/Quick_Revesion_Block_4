const express = require('express');

const server = express();
server.use(express.json());

server.get('/users/get', (req, res) =>{
    res.json({"user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
    })
});


server.get("/users/list", (req, res) =>{
    res.json({Users: [
        { "id": 1, "name": "John Doe", "email": "john@example.com" },
        { "id": 2, "name": "Jane Doe", "email": "jane@example.com" },
        { "id": 3, "name": "Bob Smith", "email": "bob@example.com" }
      ]
      })
});

server.use( (req, res) =>{
    res.json({"Massage": "route not Found..."})
});

server.listen(7896, () =>{
    console.log('server is running on 7896')
});