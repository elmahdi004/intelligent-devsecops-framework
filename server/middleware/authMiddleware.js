const jwt = require('jsonwebtoken')

const authMiddleware = async(req,res,next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === "Invalid" || !token || token.trim() === "") {
        return res.status(401).json({
            success : false,
            message : 'Unauthorised'
        });
    } 
    
    try
    {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.userData = decodedToken;
        next();
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Auth Middleware | Internal Server Error"
        })
    }
}

module.exports = {
    authMiddleware
}