const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.statics.signUp = async function(email, password, fname, lname) {

    //validation
    if(!email || !password || !fname || !lname || !email)
        throw Error("all fields must be filled")
    if(!validator.isEmail(email))
        throw Error("the email you have entered is not valid")
    if(!validator.isStrongPassword(password))
        throw Error("your password should include: uppercase letter, lowercase letter, number, and symbol")

    //check if email already exist
    exists = await this.findOne({email: email})
    if(exists)
        throw Error("this email is already signed up")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = await this.create({
        email: email, 
        password: hash,
        fname: fname,
        lname: lname,
    })

    return newUser;
}
userSchema.statics.login = async function(email, password) {

    if(!email || !password )
        throw Error("all fields must be filled")

    const user = await this.findOne({email: email})
    if(!user)
        throw Error("incorrect email")

    const match = await bcrypt.compare(password, user.password);
    if(!match)
        throw Error("incorrect password")
    
    return user;
}

const User = model("user", userSchema);
module.exports = {User};