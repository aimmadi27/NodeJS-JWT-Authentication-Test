const express = require('express');
const app = express();

const jwt= require('jsonwebtoken');
const exjwt= require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use((req, res,next ) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control_Allow_Headers', 'Content-type, Authorization');
    next();
});

const PORT = 3000;

const secretKey = 'My Super Secret Key';
const jwtMW= exjwt.expressjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id : 1,
        username : 'akhil',
        password : 'abc'
    },
    {
        id : 2,
        username : 'immadi',
        password : 'def'
    }
];

app.post('/api/login', (req,res) => {
    const { username, password } = req.body;

    for (let user of users) {
        if (username == user.username && password == user.password) {
            let token = jwt.sign({id : user.id, username : user.username}, secretKey, { expiresIn: '3m'});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                err: 'Username or password is incorrect',
                token: null
            });
        }
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see.'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        myContent: 'This is the Settings page.'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err, req, res, next) {
    if (err.name === 'Unauthorized Error') {
        res.status(401).json({
            success: false,
            officialError : err,
            err: 'Username or password in incorrect 2'
        });
    }
    else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});