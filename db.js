const { ObjectId } = require("bson");
console.log("Connected to ")
const mongoose = require("mongoose");

const { Schema } = require("mongoose");
const { describe } = require("node:test");
const { title } = require("process");

const userSchema = new Schema ({
 
   email: { type: String, unique: true},
   password: String,
   firstName: String,
   lastName: String,
})

const adminSchema = new Schema ({

    email: { type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String,
 })

 const courseSchema = new Schema ({
    
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
 })

 const purchaseSchema = new Schema ({
    
    courseId: ObjectId,
    userId: ObjectId
 })

 const userModel = mongoose.model("user",userSchema);
 const adminModel = mongoose.model("admin", adminSchema);
 const courseModel = mongoose.model("course",courseSchema);
 const purchaseModel = mongoose.model("purchase", purchaseSchema);


 module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
 }