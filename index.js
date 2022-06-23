const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/UserModel');
const pass = require('./models/Password');
const port = process.env.PORT || 3000;

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('public'));
app.set("view engine", "ejs");

const url = `mongodb+srv://ashwin:1234@cluster0.cjcyr.mongodb.net/socialDB?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose
    .connect(url, connectionParams)
    .then(() => {
        console.log("Connected to the database ");
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    });

// User.remove({},(err)=>{
//     console.log("deleted all")
// })

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.get('/home', (req, res) => {
    res.render('home')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        const user = new User({
            name,
            email,
            password: hash
        });
        user.save().then(() => {
            res.send('User created successfully');
        }
        ).catch((err) => {
            res.send('User already exists');
        }
        );
    }
    );

}
);


const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/login', (req, res) => {
    res.render('login')
}
);

app.post('/auth/login',async(req, res) => {
    const { email, password } = req.body;
    await User.findOne({ email }).then((user) => {
        if (!user) {
            res.send('User not found');
        } else {
            bcrypt.compare(password, user.password,async function (err, result) {
                if (result) {
                    // res.send('User found');
                    res.redirect('/home');
                    req.user =await user;
                    console.log(user);
                    // set a header if user is logged in
                    // res.setHeader('x-auth', user.token);
                } else {
                    res.send('Incorrect password');
                }
            }
            );
        }
    }
    ).catch((err) => {
        res.send('Error finding user');
    }
    );
}
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});