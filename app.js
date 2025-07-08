const express = require("express");
// db
const moongose = require("mongoose");

// the dotenv which has our configuration info
require("dotenv").config();
const app = express();

//middleware
app.use(express.json());

// making the files accessible
app.use("/uploads", express.static("uploads"));

// routes
// register
// auth
const auth = require("./routes/auth");
app.use("/api/auth", auth);

// user
const user=require('./routes/user')
app.use('/api/users',user)

// task
const task = require("./routes/task");
app.use("/api/task", task);

// // emp
const employee = require('./routes/employee')
app.use('/api/emp',employee)

// connecting mongodb
moongose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection error", err));
// listener
const PORT=3002
app.listen(PORT, () => {
  console.log("server running on port",PORT);
});
