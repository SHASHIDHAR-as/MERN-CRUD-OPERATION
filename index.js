const express  = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const app = express()
app.use(cors())
app.use(express.json())



const PORT  = process.env.PORT || 8080 

//schema
const schemaData  = mongoose.Schema({
    name : String,
    email : String,
    mobile : String,
},{
    timestamps : true
})

const userModel  = mongoose.model("user",schemaData)

// read
// ​ http://localhost:8080/
app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success : true , data : data})
})  


//create data || save data in mongodb
//http://localhost:8080/create
/*
{
    name,
    email,
    mobile
}
*/
// app.post("/create",async(req,res)=>{
//     console.log(req.body)
//     const data = new userModel(req.body)
//     if(req.body){
//         res.send({success:false,message:"form empty"})
//     }
//     await data.save()
//     res.send({success : true, message : "data save successfully" , data : data})
// })

app.post("/create", async (req, res) => {
    console.log(req.body);

    // Check if any required fields are missing
    const requiredFields = ["name", "email", "mobile"]; // Replace with your required fields' names
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        const errorMessage = `Please fill in all the required details: ${missingFields.join(", ")}`;
        res.send({ success: false, message: errorMessage });
    } else {
        const data = new userModel(req.body);
        try {
            await data.save();
            res.send({ success: true, message: "Data saved successfully", data: data });
        } catch (error) {
            res.send({ success: false, message: "Failed to save data", error: error.message });
        }
    }
});



//update data 
// http://localhost:8080/update
/**
 *  {
 *      id :"",
 *      name : "",
 *      email : "",
 *       moible : ""
 * }
 */

app.put("/update",async(req,res)=>{
    console.log(req.body)
    const { _id,...rest} = req.body 

    console.log(rest)
    const data = await userModel.updateOne({ _id : _id},rest)
    res.send({success : true, message : "data update successfully", data : data})
})

//delete api
// http://localhost:8080/delete/id
app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id : id})
    res.send({success : true, message : "data delete successfully", data : data})
})



// mongoose.connect("mongodb://127.0.0.1:27017/crudoperation")
// mongodb+srv://shashidhar:<password>@cluster0.a1mcy8h.mongodb.net/?retryWrites=true&w=majority
const DB = process.env.DATABASE
console.log(DB)
mongoose.connect( DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>{
    console.log("connect to DB")
    app.listen(PORT,()=>console.log("Server is running"))
})
.catch((err)=>console.log(err))

