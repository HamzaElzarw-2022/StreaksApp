const {User} = require('../models/user')
const jwt = require('jsonwebtoken')

const createToken = async (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const login = async (req, res) => {
    const {email, password} = req.body;
    console.log("signup recieved")

    try {

        const user = await User.login(email, password)
        const token = await createToken(user._id)

        res.json({
            status: true,
            email: email,
            token: token
        })

    } catch (error){
        res.json({
            status: false,
            message: error.message
        })
    }


}

const signUp = async (req, res) => {
    const {email, password, fname, lname} = req.body;
    console.log("signup recieved")
    try {

        const user = await User.signUp(email, password, fname, lname)
        const token = await createToken(user._id)

        res.json({
            status: true,
            email: email,
            token: token
        })

    } catch (error){
        res.json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {login, signUp}