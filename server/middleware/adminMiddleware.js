const jwt = require('jsonwebtoken')

const adminMiddleware = async(req,res,next) => {
    
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
        
        if(decodedToken.role !== "ADMIN")
        {
            return res.status(401).json({
                success : false,
                message : 'Unauthorised'
            })
        }
        
        req.userData = decodedToken;
        next();
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Admin Middleware | Internal Server Error"
        })
    }
}

module.exports = {
    adminMiddleware
}