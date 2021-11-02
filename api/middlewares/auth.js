const jwt = require('jsonwebtoken');
const User = require('../../models/user/user.model');
const { jwtSecretKey } = require('../../config');
const roles = require('../../config/role')
var composable = require('composable-middleware')

/*
The isAuth function is a middleware function that checks if the user is authenticated.

Args:
  req: The request object.
  res: The response object.
  next: The next middleware function in the chain.
Returns:
  The user object is being returned.
*/
const isAuth = async(req, res, next) => {
    try {
        const token = await req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecretKey)
        let user = await User.findOne({ '_id': decoded._id, 'tokens.token': token })
        if (!user) {
            return res.status(401).send("Token error")
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        return res.status(401).send({ error: 'Please authenticate' })
    }
}


/*
The isPhUser function checks if the user is a PHUSER. 
If the user is a PHUSER, the function calls the next() function to move to the next middleware. 
If the user is not a PHUSER, the function sends a 403 response to the client.

Args:
  req: The request object.
  res: The response object.
  next: The next middleware function in the chain.
Returns:
  The middleware function is being returned.
*/

const isPhUser = async(req, res, next) => {
    if (req.user.role == roles.userRoles.PHUSER) {
        next()
    } else {
        res.status(403).send({ message: "Access denied !" })
    }
}

const isSeeker = async(req, res, next) => {
    if (req.user.role == roles.userRoles.SEEKER) {
        next()
    } else {
        res.status(403).send({ message: "Access denied !" })
    }
}

const isAdmin = async(req, res, next) => {
    if (req.user.role == roles.userRoles.ADMIN) {
        next()
    } else {
        res.status(403).send({ message: "Access denied !" })
    }
}

const isDhUser = async(req, res, next) => {
    if (req.user.role == roles.userRoles.DHUSER) {
        next()
    } else {
        res.status(403).send({ message: "Access denied !" })
    }
}

module.exports = {
    isAuth,
    isPhUser,
    isSeeker,
    isAdmin,
    isDhUser
}