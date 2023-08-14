const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();


const connection = mysql.createConnection({
    host:'db.teamlog.kr',
    user:'admin',
    password: 'teamlog2023!',
    database:'jjm_10119'
});

connection.connect();

app.use(cookieParser());
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

function generateHash(inputString) {
    const hash = crypto.createHash("md5").update(inputString).digest("base64");
    return hash;
}

app.get('/post', (req,res) => {
    if (req.session.isLoggedIn) {
        res.render('unauthorizedpost');
    }
    else {
        res.render('authorizedpost');
    }
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
    
    connection.query(`SELECT * FROM users where username='${username}' and password='${generateHash(password)}'`, function(error,data){
        if (error) {
            console.log(error);
        }

        if (!Object.keys(data).length) {
            alert("아이디 또는 비밀번호가 틀렸습니다.")
            return res.redirect('/login');
        }
        else {
            return res.redirect('/post');
        }
    });
});



app.listen(3000);
