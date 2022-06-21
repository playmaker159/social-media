const mongoose = require('mongoose');

const Password=new mongoose.Schema({
    password:String
}
);

const pass=mongoose.model('Password',Password);
module.exports=pass;