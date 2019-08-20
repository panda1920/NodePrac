const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        let token = extractAuthTokenFromRequest(req);
        let decoded = jwt.verify(token, 'thisismycourse');
        let user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        
        if (!user)
        throw new Error();
        
        req.authToken = token;
        req.authenticatedUser = user;
        next();
    } catch (e) {
        res.status(401).send('error: User authentication required');
    }
}

function extractAuthTokenFromRequest(req) {
    return req.header('Authorization').replace('Bearer ', '');
}

module.exports = auth;