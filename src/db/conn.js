const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/userregistration").then(()=>{console.log("CONNECTED ")}).catch((err)=>{console.log("ERROR"+err)})