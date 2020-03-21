let express = require('express');
let _router = express.Router();
let multer = require('multer');
let path = require('path');  
const debug = require('debug')('myapp:server');
const logger = require('morgan');
const serveIndex = require('serve-index')
let config = require('../config');
let token = require('../token');
var atob = require('atob');
const fs = require("fs")




var storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const valueToken = token[1]
        var base64TokenValue = valueToken.split('.')[1];
        var decodedValue = JSON.parse(atob(base64TokenValue));
        
        cb(null, './uploads/' + decodedValue.subject)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});




//will be using this for uplading
const upload = multer({ storage: storage });

//get the router
//const userRouter =require('./routes/user.route');

_router.use(logger('tiny'));
_router.use(express.json());
_router.use(express.urlencoded({ extended: false }));
//app.use(express.static('public'));

_router.post('/testUpload', upload.single('file'), function(req,res) {
    debug(req.file);
    console.log('storage location is ', req.hostname +'/' + req.file.path);
    return res.send(req.file);
})

//_router.use(express.static('file'));

//app.use(express.static('public'));
// let user = token.checkToken;
// console.log("token value - " + user);


_router.get('/download/:name', token.checkToken(), (req, res) => {
    var file =  + req.params.name;
    //var fileLocation = path.join('/Users/Thisal/Desktop/DanaAyyaAssignment/server/uploads/',file);
    //console.log("entire download path is -- ", fileLocation);
    console.log("Entire download path is - ", '/Users/Thisal/Desktop/DanaAyyaAssignment/server/uploads/' + req.decoded.subject + "/" + req.params.name)
    res.download('/Users/Thisal/Desktop/DanaAyyaAssignment/server/uploads/' + req.decoded.subject, req.params.name); 
    //res.status(200).send("Alright !")
  });


_router.delete("/:name", token.checkToken(), function(req, res){
    console.log("delete parameter", req.params.name);



    // delete file named 'sample.txt'
    fs.unlink('/Users/Thisal/Desktop/DanaAyyaAssignment/server/uploads/' + req.decoded.subject + "/" + req.params.name, function (err) {
        if (!err) {
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        }
        else{
            console.log(err);
        }
    })

    res.status(200).send('ok')


});



_router.use('/check' ,express.static('server/uploads' ),serveIndex('./uploads', {'icons': true}));

_router.get("/list", token.checkToken(), function(req, res){
    //express.static('server/uploads' ),serveIndex('./uploads', {'icons': true})
    
    //const dir_path = path.join(__dirname, '/Users/Thisal/Desktop/DanaAyyaAssignment/server/uploads');


    //passsing dir_path and callback function
    fs.readdir('/Users/Thisal/Desktop/DanaAyyaAssignment/server/uploads/' + req.decoded.subject , function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to find or open the directory: ' + err);
    } 
    //Print the array of images at one go
    console.log(files);
    //listing all files using forEach
    files.forEach(function (file) {
        // TODO: Do whatever you want to do with the file
    console.log(file); 

    });

    res.status(200).send({files: files});
});

})




//if end point is /users/, use the router.
//_router.use('/users', userRouter);



// let upload = multer({storage:store}).single('file');

//  _router.post('/upload', function(req, res, next){
//      console.log("inside upload from the server side")
//     upload(req, res, function(err){
//         if(err){
//             return res.status(501).json({error: err});
//         }
//         else{
//             res.json({originalname:req.file.originalname, uploadname:req.file.filename});
//         }
//     })
//  });

//  _router.post('/download', function(req,res,next){
//     filepath = path.join(__dirname,'../uploads') +'/'+ req.body.filename;
//     res.sendFile(filepath);
// });

 module.exports = _router;
 