const express=require('express')
const {User}=require('../models/model')
const { message } = require('statuses')

const router=express.Router()

// view all users
router.get('/',async(req,res)=>{
    try {
        const users=await User.find()
        res.json(users)
    } catch (error) {
res.status(500).json({message:error.message})
    }
})

// get one user
router.get('/:id', async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message:'user not found'})
        }

        res.json(user)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

// update a user
router.put('/:id',async(req,res)=>{
    try {
        const{name,email,password}=req.body
        // checking if the user we are updating exists
        const existUser= await User.findOne({email})
        if (!existUser) return res.status(404).json({message:'user not found'})
        const user = await User.findByIdAndUpdate(req.params.id, {
          name,
          email,
          password,updatedAt:Date.now()
        },{new:true});
        res.json({user})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// delete a user
router.delete('/:id',async(req,res)=>{
  try {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      if (!deleteUser)
        return res.status(404).json({ message: "user not found" });
      res.json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})
// export
module.exports=router
