const express = require('express')
const{Employee,Task}=require('../models/model')
const auth=require('../middleware/auth')
const { message } = require('statuses')

const router=express.Router()

// creating an employee
router.post('/',auth,async(req,res)=>{
try {
  // destruturing
  const { email, taskId } = req.body;
  // check if an employee exists
  const existEmail = await Employee.findOne({ email });
  if (existEmail) return res.json({ message: "email already exists" });
 
  // check if task exists
  const existTask = await Task.findById( taskId );
  if (!existTask) return res.status(404).json({ message: "task not found" });

  // saving the employee permanently
  const emp = new Employee({...req.body, userId: req.user.id});
  const savedEmp=await emp.save();
  res.status(201).json(savedEmp);
} catch (error) {
    res.status(500).json({message:error.message})
}

})

// get
router.get('/',auth,async(req,res)=>{
    try {
        const emp = await Employee.find().populate('taskId', 'name')
        res.json(emp);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// get_one
router.get("/:id", auth, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).populate("taskId", "name");
    res.json(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update
router.put('/:id',auth,async(req,res)=>{
  try {
      const { email, taskId, salary } = req.body;
      // check if the user exists
      const existEmp = await Employee.findOne({ email });
      if (!existEmp)
        return res.status(404).json({ message: "employee not found" });

      const updatedEmp = await Employee.findByIdAndUpdate(
        req.params.id,
        { email, taskId, salary, updatedAt: Date.now() },
        { new: true }
      );
      res.json(updatedEmp);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})
// exports
module.exports=router