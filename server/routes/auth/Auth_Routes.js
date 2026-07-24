const express = require('express')
const {handleSignup, handleLogin} = require('../../controllers/auth/Auth_Controller')
const {authMiddleware} = require("../../middleware/authMiddleware")
const AuthRouter = express.Router();

AuthRouter.post('/signup',handleSignup);

AuthRouter.post('/login',handleLogin);

AuthRouter.get('/verifyAuth',authMiddleware,(req,res) => {
    const user = req.userData;
    res.status(200).json({
        success : true,
        message : "Authenticated",
        user : user
    })
});

module.exports = AuthRouter;