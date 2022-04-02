const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const path = require("path");
const Register = require("./models/register");
const bcrypt = require("bcryptjs");
require("./db/conn.js");

const port = process.env.PORT || 4545;
const static_path = path.join(__dirname, "./public");
app.use(express.static(static_path));
console.log(static_path);
//To get data from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// these two line is used
app.get("/", (req, resp) => {
  resp.send("HELOO FROM SERVER");
});

// we created this method as async bcoz it will return promise
app.post("/register", async (req, resp) => {
  try {
    const password = req.body.pass;
    const cPassword = req.body.repass;
    if (password == cPassword) {
      const registeredemployee = new Register({
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        courses: req.body.courses,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        pass: req.body.pass,
        repass: req.body.repass,
      });

      const token = await registeredemployee.generateTokens();
      console.log(token);
      const register = await registeredemployee.save();
      console.log(register);
      resp.status(200).send("DATA IS SAVED");
    } else {
      resp.send("password is not matched");
    }
  } catch (err) {
    resp.status(400).send(err);
  }
});

app.get("/login", (req, resp) => {
  let abspath = path.join(__dirname, "./public/login.html");
  resp.sendFile(abspath);

  console.log(abspath);
});
// for login validation
app.post("/login", async (req, resp) => {
  try {
    const userEmail = req.body.username;
    const userPass = req.body.password;

    const user = await Register.findOne({ email: userEmail });
    console.log("user data", user);
    const isMatched = await bcrypt.compare(userPass, user.pass);
    console.log("ismatcjed", isMatched);
    // generating token while login
    // we will use user bcoz it intance of collection
    const token = await user.generateTokens();
    console.log("TOKEN", token);
    // bcrypt login logic
    
    
    
    if (isMatched) {
      console.log(user);
      resp.send("VALID USER");
    } else {
      resp.send("INVALID USER");
    }





    // simple login logic
    // if(user.pass==userPass)
    // {
    //     console.log(user);
    //     resp.send("VALID USER");
    // }else{
    //     resp.send("INVALID USER password does not  match");
    // }
  } catch (err) {
    console.log("SOME ERROR OCCURED" + err);
    resp.send("INVALID DATA ENTRY");
  }
});

// // bcrypt password logic
// // const securePassword=async(password)=>
// // {
// // const hashPassword=await bcrypt.hash(password,10);
// // console.log(hashPassword);
// // // the first parameter is user entered password and secound is stored password in db
// // const matchPassword=await bcrypt.compare(password,hashPassword);
// // console.log("MATCH ",matchPassword)
// // }

// // securePassword("Himanshu");

// jwt token code
// const createToken=async ()=>
// {
//     const token =await jwt.sign({_id:"6236f4d16b1f7ee5839c0cd6"},"somedayiwillfly",{expiresIn:"10 seconds"});
//     console.log(token);
//    const userVerify =await jwt.verify(token,"somedayiwillfly");
//    console.log(userVerify);
// }
// createToken();
app.listen(port, () => {
  console.log("PORT IS RUNNING");
});
