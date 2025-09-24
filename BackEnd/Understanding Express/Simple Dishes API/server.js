const express = require("express");
const fs = require('fs');

const server = express();

server.use(express.json());

const readDB = () => fs.readFileSync('db.json', 'utf-8');
const writeDB = (data) => fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

server.get("/dishes", (req, res) =>{
    const data = JSON.parse(readDB());
    res.status(200).send(data.dishes)
});

// Get Data By ID;

server.get("/dishes/:id", (req, res) =>{
    const data = JSON.parse(readDB());
    const dish = data.dishes.find(u=> u.id === parseInt(req.params.id));
    if(dish) return res.status(200).send(dish);
    return res.status(404).json({"message": "id not found"})
});

server.post("/dishes", (req, res) => {
    const data = JSON.parse(readDB());
    const newDish = {
        id: Date.now(),
        ...req.body
    };
    data.dishes.push(newDish)
    writeDB(data);
    res.status(201).json(newDish);
});

// Update Dish by using ID;

server.put("/dishes/:id", (req, res) =>{
    const data = JSON.parse(readDB());
    const index = data.dishes.findIndex(u => u.id === parseInt(req.params.id));
    if(index !== -1){
        data.dishes[index] = {...data.dishes[index], ...req.body};
        writeDB(data)
        res.status(201).send(data.dishes[index])
    }else{
        res.status(404).json({"message" : 'id not found'})
    }
});

// DELETE by ID;

server.delete("/dishes/:id", (req, res) =>{
    const data = JSON.parse(readDB());
    const deletedId = data.dishes.filter(u => u.id !== parseInt(req.params.id))
    if(deletedId.length !== data.dishes.length){
        data.dishes = deletedId;
        writeDB(data)
        res.json({"message": `the data of id ${req.params.id} deleted succussfuly`})
    }else{
        res.status(404).json({'message' : `id not found`})
    }
});

// Search Dishes using URL;

server.get("/dishes/search", (req, res) => {
    try {
        const data = JSON.parse(readDB());
        const { name: searchQuery } = req.query; // Changed from 'dish' to 'name' to match error message

        console.log("Searching for:", searchQuery); // Moved before response
        console.log("Available dishes:", data.dishes.map(d => d.dish));

        if (!searchQuery) {
            return res.status(400).json({"message": 'Please provide a dish name in query (e.g. ?name=pizza)'});
        }

        const searchResult = data.dishes.filter(item =>
            item.dish.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (searchResult.length === 0) {
            return res.status(404).json({'message': 'No Matching Dish found'});
        }

        res.status(200).json({dishes : searchResult});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"message": "Internal server error"});
    }
});

// Others Routes 
server.use((req, res) => {
    res.status(404).json({"error" : 'Route not found..!'})
})

server.listen(4000, () => {
    console.log(`server is running on http://localhost:4000`)
});