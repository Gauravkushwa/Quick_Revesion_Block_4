const express = require("express");
const router = express.Router();
const controller = require("../controllers/task.controller");

router.post("/tasks", controller.createTask);
router.get("/tasks", controller.getTasks);
router.patch("/tasks/:id", controller.updateTask);
router.delete("/tasks/:id", controller.deleteTask);

module.exports = router;
