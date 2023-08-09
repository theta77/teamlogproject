const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password: 'wjdwlals7',
    database:'project'
});

connection.connect();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

function generateHash(inputString) {
    const hash = crypto.createHash("md5").update(inputString).digest("base64");
    return hash;
}

app.get('/board', (req,res) => {
    
})

app.get('/register', function(req,res) {
    res.render('register');
});

app.post('/register', function(req, res) {
    const {username, password} = req.body;
    
    connection.query(`INSERT INTO users (username, password) VALUES('${username}', '${generateHash(password)}')`, function(error) {
        if (error) {
            console.log(error);
        }
        res.render('login');
    });
});

app.get('/login', function(req,res){
    res.render('login');
})

app.post('/login', function(req,res){
    const {username, password} = req.body;
    const articlesname = connection.query('SELECT name FROM users')
    connection.query(`SELECT * FROM users where username='${username}' and password='${generateHash(password)}'`, function(error,data){
        if (error) {
            console.log(error);
        }

        if (!Object.keys(data).length) {
            res.render('unauthorizedboard', {articlesname});
        }
        else {
            res.render('authorizedboard', {username, articlesname});
        }
    });
});



app.listen(3000);
