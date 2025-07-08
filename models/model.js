const mongoose=require('mongoose');


// define the schema
const Schema = mongoose.Schema

// users schema
const userSchema=new Schema({
    name:String,
    email:{type:String,required:true,uniqe:true},
    phone:Number,
    dob:{type:Date, default:Date.now},
    password:{type:String,required:true},
    photo:String

})

// employees schema
const employeeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  taskId: { type: Schema.ObjectId, ref: "Task", required: true },
  taskTitle: { type: String },
  hireDate: { type: Date },
  salary: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// task Schema
const taskSchema=new Schema({
    name:{type:String, required:true},
    description:{type:String},
    supervisorId:{type:Schema.ObjectId,ref:"Employee",default:null},
    createdAt:{type:Date,default:Date.now},
    endingAt:{type:Date}
})

const User=mongoose.model('User', userSchema)
const Employee=mongoose.model('Employee',employeeSchema)
const Task = mongoose.model('Task',taskSchema)

// exporting schema
module.exports={User,Task,Employee}
