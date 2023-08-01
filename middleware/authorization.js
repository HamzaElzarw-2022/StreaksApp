const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authorization = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers

  if (!authorization) {
    return res.json({
        status: false,
        message: "user not authorized"
    })
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)

    req.user_id = (await User.findById(_id).select('_id'))._id
    next()

  } catch (error) {
    console.log(error)
    res.json({
        status: false,
        message: "user not authorized"
    })
  }
}

module.exports = authorization;