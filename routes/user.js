const { Router } = require("express");
const {z} = require("zod");
const bcrypt = require("bcrypt");
const { userModel, purchaseModel, courseModel } = require("../db");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } =require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup",async function(req,res){

    const { email, password, firstName, lastName} = req.body; // 
    
    const requiredBody = z.object({
        // Check that the password has 1 uppercase zchar, 1 lowercase char, 1 spl character
        email: z.string().min(3).max(100).email(),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100),
        password: z.string().min(3).max(30)
    })
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success){
res.json({
    message: "Incorrect format",
    error: parsedDataWithSuccess.error
})
    }
    
    let errorThrown= false;
    try{
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    await userModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    }); 
} catch (e){
    res.json({
        message: "User already exists"
    })
    errorThrown = true;
}
    if(!errorThrown){
    res.json({
        message: "You are logged in"
    }) }


   

})

userRouter.post("/signin",async function(req,res){
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    });
if (!user){
    res.status(403).json({
        message: "User doesn't exit in out db"
    })
    return
}

const passwordMatch = await bcrypt.compare(password,user.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()
        } , JWT_USER_PASSWORD)
        res.json ({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }


})

userRouter.get("/purchases",userMiddleware,async function(req,res){
    const userId = req.userId;
    
  const purchases =  await purchaseModel.find({
        userId
    })
    
    let purchasedCourseIds = [];

    for (let i = 0 ; i<purchases.length; i++){
        purchasedCourseIds.push(purchases[i].courseId)
    }
    const coursesData = await courseModel.find({
        // _id: {$in: purchases.map( x => x.courseId)}
        _id: { $in:  purchasedCourseIds }
    })
    res.json({
        purchases, 
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}

