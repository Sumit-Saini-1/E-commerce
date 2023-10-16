const jwt = require('jsonwebtoken');
function createToken(userId){
    const token = jwt.sign({
        userId
    },
        'ourSecretKey',
        { expiresIn: '10m' }
    );
    return token;
}

function verifyToken(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'ourSecretKey', function (err, decoded) {
            if (err) {
                console.log(16,err);
                reject(false);
            }
            else {
               resolve(decoded);
            }
        });
    });
}

module.exports={
    createToken,
    verifyToken
}