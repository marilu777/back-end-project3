
const {expressjwt: jwt} = require('express-jwt');

function getTokenFromHeaders(req){
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        const token = req.headers.authorization.split(' ')[1]
        return token;
    }
    return null;

    // Exaple of the authorization 
    //{authorization: "Bearer nsof8943nofi9839nfco"}
}

const isAuthenticaded = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders,
})

module.exports = {
    isAuthenticaded,
};