const expressJwt = require('express-jwt');
const config = require('./jwt_config.json');

module.exports = jwt;

function jwt() {
    const { secret } = config;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/api/user/login'
            //,'/api/users/add' //omment out / remobve after admin user created
        ]
    });
}