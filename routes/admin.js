const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db")
const bcrypt = require("bcrypt");
const {z} = require("zod")
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } =require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function(req,res){
    
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

    await adminModel.create({
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

adminRouter.post("/signin",async function(req,res){
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    });
if (!admin){
    res.status(403).json({
        message: "User doesn't exit in out db"
    })
    return
}

const passwordMatch = await bcrypt.compare(password,admin.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: admin._id.toString()
        } , JWT_ADMIN_PASSWORD)
        res.json ({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

})

adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title: title,
         description: description, 
         imageUrl: imageUrl,
          price: price, 
          creatorId: adminId
    })

    res.json({
        message: "course created",
        courseId: course._id

    })
})
adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title: title, 
         description: description, 
         imageUrl: imageUrl,
          price: price, 
        
    })
    
        res.json({
            message: "course updated",
            courseId: course._id
    
        }) 
    
    })

adminRouter.get("/course/bulk",adminMiddleware , async function(req,res){
    const adminId = req.userId;

    const courses = await courseModel.findOne({
        creatorId: adminId
    });

    res.json({
        message: "course are here",
        courses

    })
})

module.exports = {
    adminRouter: adminRouter
}