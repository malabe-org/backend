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
The `hasRole` middleware will check if the user has the required role. 
If the user has the required role, the middleware will call the next middleware in the chain. 
If the user does not have the required role, the middleware will send a 401 response.

Args:
  req: The request object.
  res: The response object.
  next: The next middleware function in the chain.
Returns:
  A middleware function
*/
const hasRole = (requiredRole) => {
    if (!requiredRole) throw new Error('Required role needs to be set');
    return composable()
        .use(function(req, res, next) {
            isAuth(req, res, next);
        })
        .use(function meetRequirements(req, res, next) {
            if ((roles.userRoles.indexOf(req.user.role) === roles.userRoles.indexOf(requiredRole))) {
                return next();
            } else res.status(401).send({ error: 'Forbiden' });
        })
}

module.exports = {
    isAuth,
    hasRole,
}