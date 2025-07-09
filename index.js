require("dotenv").config()
console.log(process.env.MONGO_URL)
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { adminRouter } = require("./routes/admin")
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const app = express();

app.use(express.json()); 

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);




app.post("/purchasedCourses",function(req,res){
    
})
 function main(){
//dotenv
mongoose.connect(process.env.MONGO_URL)
app.listen(3000)

}

main()




