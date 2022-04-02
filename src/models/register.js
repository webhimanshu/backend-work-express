const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const { response } = require("express");
const employeeScheme=new  mongoose.Schema(
    {
        firstname:
        {
            type:String,
            required:true,

        },
        middlename:
        {
            type:String,
            required:false,
        },
        lastname:{
            type:String,
            required:true,
        },
        courses:
        {
            type:Array,
            required:true,
        },
        gender:{
            type:String,
            required:true,
        },
        phone:{
            type:Number,
            required:true,
            unique:true,
        },
        address:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        pass:{
            type:String,
            required:true,
        },
        repass:{
            type:String,
            required:true,
        },
        tokens:[
            {
                token:
                {
                    type:String,
                    required:true,
                }
            }]



    });
    // for generation tokens
employeeScheme.methods.generateTokens=async function()
{
   const token =await   jwt.sign({_id:this._id},"somedayiwillflydevoid");
   this.tokens=this.tokens.concat({token:token});
    await this.save();
   console.log(token);
   return token;
}
    // here pre method is run before saving password in db
    //next method indiactes that it will move forward it mandatory to call next method
    //password to hash
employeeScheme.pre("save", async function(next)
{



 
    this.pass=await bcrypt.hash(this.pass,10);
   
   this.repass=await bcrypt.hash(this.pass,10);
   next();


});

    const Register=new mongoose.model("Register",employeeScheme);
    module.exports=Register;