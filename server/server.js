const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const api = require('./routes/api');
const fileRoutes = require('./routes/file');
const app = express();

//port number for the application
const PORT = 3000;

//connect to mongoDB using mongoose
mongoose.connect("mongodb://localhost/dropbox", (error)=> {
    if(!error){
        console.log("success");
    }
    else{
        console.log('Failed!');
    }
});

//middle~ware
app.use(cors());

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
  })

app.use(bodyParser.json());

//specify two routes 
//one for login/registration via /API route
//second one for the file operations via /file route
app.use('/api', api);
app.use('/file', fileRoutes);


app.listen( PORT,"localhost" ,function(){
    console.log("Listning from the port number: " + PORT);
})