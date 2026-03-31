const JWT = require("jsonwebtoken");
const User = require("../models/User.js")

// Generate JWT Token
const generateToken = (id) => {
    return JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
exports.registerUser = async(req, res) => {
    const {fullName, email , password, profileImage } = req.body;

    // Validaion: Check for missing fields
    if(!fullName || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        })
    } 

    try {
        
        // Check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "Email already exist"
            })
        }

        // Create new User
        const user = await User.create({
            fullName,
            email,
            password,
            profileImage
        })

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}

// LoginUser User
exports.loginUser = async(req, res) => {
   const  {email, password} = req.body;
   if(!email || !password){
    return res.status(400).json({
        message: "All fields are required"
    })
   }

   try {
    
    const user = await User.findOne({email});
    if(!user || !(await user.comparePassword(password))){
        return res.status(400).json({
            message: "Invalid Credentials"
        });
    }

    res.status(200).json({
        id: user._id,
        user,
        token: generateToken(user._id)
    });

   } catch (err) {
    res.status(400).json({
        message: err.message
    })
   }

}

// getUserInfo User
exports.getUserInfo = async(req, res) => {
     try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(400).json({
                message: "User not found"
            })
        }

        res.status(200).json(user);

     } catch (err) {
        res.status(400).json({
            message: "Error Registering User", error: err.message
        })
     }
}
