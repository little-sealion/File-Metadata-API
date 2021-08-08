var express = require('express');
var cors = require('cors');
require('dotenv').config()
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
var app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// add other middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/public', express.static(process.cwd() + '/public'));

//set the home page
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let upfile = req.files.upfile;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            upfile.mv('./uploads/' + upfile.name);

            //send response
            res.send({
                status: "OK",
                message: 'File is uploaded',
                data: {
                    name: upfile.name,
                    type: upfile.mimetype,
                    size: upfile.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
