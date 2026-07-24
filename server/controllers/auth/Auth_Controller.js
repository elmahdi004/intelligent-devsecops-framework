const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')

const handleSignup = async(req,res) => {
    const {username,email,password} = req.body;

    try
    {
        const emailExists = await User.findOne({Email:email})
        if (emailExists){
            return res.json({
                success:false,
                message : "Account already exists"
            })
        }

        const usernameExists = await User.findOne({Username:username})
        if (usernameExists){
            return res.json({
                success:false,
                message : "Username already taken"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password,Number(process.env.HASH_SALT));
        const newUser = new User({
            Username : username,
            Email  :email,
            Password : hashedPassword
        })
        await newUser.save()
        return res.status(200).json({
            success : true,
            message : "Account successfully created"
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Signup | Internal Server Error"
        })
    }
}

const handleLogin = async(req,res) => {
    const {email,password} = req.body;

    try
    {
        const customer = await User.findOne({Email : email})
        if(!customer)
        {
            return res.json({
                success : false,
                message : "Account does not exist"
            })
        }

        const validPassword = await bcrypt.compare(password,customer.Password);
        if(!validPassword)
        {
            return res.json({
                success : false,
                message : "Invalid password | Try again"
            })
        }

        const token = jwt.sign({
            id : customer._id,
            username : customer.Username,
            email : customer.Email,
            role : customer.Role,
        },
        process.env.JWT_SECRET_KEY,
        )

        return res.status(200)
        .json({
            success : true,
            message : "Log in successful",
            token,
            user : {
                id : customer._id,
                username : customer.Username,
                email : customer.Email,
                role : customer.Role,
            }
        })

        
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Login | Internal Server Error"
        })
    }
}

module.exports = {
    handleSignup,
    handleLogin
};