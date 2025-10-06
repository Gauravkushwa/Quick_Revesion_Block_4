const express = require("express");
const fs = require("fs");
const { createClient } = require("redis");

const app = express();
app.use(express.json());

// Initialize Redis client
const redisClient = createClient();
redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

// Connect Redis
(async () => {
  await redisClient.connect();
  console.log("✅ Connected to Redis");
})();

// Helper function to read simulated DB (data.json)
const readData = () => {
  const data = fs.readFileSync("./data.json", "utf-8");
  return JSON.parse(data);
};

// Helper function to write to simulated DB
const writeData = (data) => {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
};

// =============================
//        ROUTES
// =============================

// GET /items → Fetch all items (with caching)
app.get("/items", async (req, res) => {
  const cacheKey = "items:all";

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("🟢 Cache Hit");
      return res.json(JSON.parse(cachedData));
    }

    console.log("🔴 Cache Miss");
    const data = readData();

    // Cache data with TTL = 60 seconds
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });

    res.json(data);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /items → Add new item & invalidate cache
app.post("/items", async (req, res) => {
  try {
    const items = readData();
    const newItem = { id: Date.now(), name: req.body.name || "Untitled" };
    items.push(newItem);
    writeData(items);

    // Invalidate cache
    await redisClient.del("items:all");
    console.log("🗑️ Cache invalidated (POST)");

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /items/:id → Update an item & invalidate cache
app.put("/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = readData();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1)
      return res.status(404).json({ message: "Item not found" });

    items[index].name = req.body.name || items[index].name;
    writeData(items);

    await redisClient.del("items:all");
    console.log("🗑️ Cache invalidated (PUT)");

    res.json(items[index]);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /items/:id → Delete an item & invalidate cache
app.delete("/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let items = readData();
    const newItems = items.filter((item) => item.id !== id);

    if (newItems.length === items.length)
      return res.status(404).json({ message: "Item not found" });

    writeData(newItems);
    await redisClient.del("items:all");
    console.log("🗑️ Cache invalidated (DELETE)");

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
