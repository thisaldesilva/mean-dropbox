//this handles all file related requests

const express = require("express");
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
var fs = require('fs');
let config = require('../config');

//adding new user 
router.post('/register', (req, res) => {
    //get the user inputed data from the http body
    let userData = req.body;
    //create a user instance
    let user = new User(userData);
    //save the user on to mongoDB
    user.save((error, registereduser) =>{
        if(error){
            console.log(error);
        }
        else{
            //if the saving was successful
            //generate the jwt token and send it to the browswer (front-end)
            let payload = {subject: registereduser.email};
            let token = jwt.sign(payload, 'secretkey');
            res.status(200).send({token});
            
            //console.log("Registered ID - " , registereduser._id);
            //create a separate folder for each new user
            try{
                fs.mkdirSync("./uploads/" + userData.email);
            }
            catch{
                if(error.code == "EEXIST"){
                    console.log("The directory exist");
                }
                else{
                    console.log(err);
                }
            }
            
        }
    });
})


//user login
router.post('/login', (req, res) => {
    //get the user typed data from the http body
    let userData = req.body;

    //check if the user email exist 
    User.findOne({email: userData.email}, (error, user)=> {
        if(error){
            console.log(error);
        }
        else{
            if(!user) {
                res.status(401).send("Invalid Email Address.");
            }
            else{

                //if the user email exist then check if the given password is correct 
                if(user.password !== userData.password){
                    res.status(401).send("Invalid Password.");
                }
                else{
                    //successful login 
                    //generate the jwt token and send it to the browswer (front-end)
                    let payload = {subject: userData.email}
                    let token = jwt.sign(payload, config.secret);
                    res.status(200).send({token});
                }
                 
            }
        }
    })
})

module.exports = router;