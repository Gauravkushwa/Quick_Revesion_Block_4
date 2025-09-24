const express = require('express');

const server = express();
server.use(express.json())
server.get('/home', (req, res) =>{
    res.json(`<h1>Welcome to home page</h1>`)
});

server.get("/aboutus", (req, res) =>{
    res.json({"Message": "Welcome to About us"})
});

server.get('/contactus', (req, res) =>{
    res.json({
        
            "contacts": [
              {
                "id": 1,
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-0123",
                "address": {
                  "street": "123 Main Street",
                  "city": "New York",
                  "state": "NY",
                  "zipCode": "10001",
                  "country": "USA"
                },
                "company": "ABC ,Corporation",
                "jobTitle": "Software Developer"
              }
            ]
          
    })
});

server.listen(7896, () =>{
  console.log('server is running on 7896')
});