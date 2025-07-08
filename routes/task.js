const express = require("express");
const { Task } = require("../models/model");
const { message } = require("statuses");
// const { message } = require("statuses");

const router = express.Router();
// create a new task
router.post("/", async (req, res) => {
  try {
    // destructuring
    const { name, description } = req.body;
    const task = new Task({ name, description });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all tasks
router.get("/", async (req, res) => {
  console.log("get tasks");
  try {
    const tasks = await Task.find(); //.populate('supervisorId','firstName lastName')
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get one task
router.get("/:id", async (req, res) => {
  try {
    const tasks = await Task.findById(req.params.id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update tasks
router.put("/:id", async (req, res) => {
  try {
    // destructure
    const { name, description } = req.body;
    const existTask = await Task.findByIdAndUpdate(
      req.params.id,
      { name, description, updatedAt: Date.now() },
      { new: true }
    );
    if (!existTask) return res.status(404).json({ message: "task not found" });
    res.json(existTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete tasks
router.delete("/:id", async (req, res) => {
  try {
    const task= await Task.findByIdAndDelete(req.params.id)
    if(!task) return res.status(404).json({message:'task not found'})
    res.status(200).json({message:'task deleted successfully'})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
});
// exports
module.exports = router;
