import {UserModel} from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import createError from 'http-errors';

export const register = async (req, res, next) => {
    try {
        // Check if the email already exists
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }
        
        const passwordToBeBalidated = req.body.password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(passwordToBeBalidated)) {
            return res.status(400).json({ message: "Password should have at least one uppercase letter, one lowercase letter, one number, and one special character." });
        }
    
        //generate salt for password
        const salt = await bcrypt.genSalt(10); 
        //combine the salt and the hashed password
        const hashedPassword = await bcrypt.hash(req.body.password, salt); 


        const newUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth,
            profileImage: req.body.profileImage,
            address: {
                street: req.body.address?.street,
                city: req.body.address?.city,
                state: req.body.address?.state,
                postalCode: req.body.address?.postalCode,
                country: req.body.address?.country
            },
            phoneNumber: req.body.phoneNumber,
            bio: req.body.bio
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        const userObject = savedUser.toObject(); // Convert the Mongoose document to a plain JavaScript object
        delete userObject.password; // Remove the password
        delete userObject.isAdmin;  // Remove the isAdmin field
        res.status(201).json({ message: "User registered successfully!", user: userObject });

    } catch (error) {
        console.error("Error:", error);
        // Catch any errors and send an error response
        res.status(500).json({ message: "Error registering the user", error: error.message });
    }
}


export const login = async (req, res, next) => {
    try {
       const user = await UserModel.findOne({email:req.body.email})
       if(!user) return next(createError(404, "User not found"))

       const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
       if(!isPasswordCorrect) 
            return next(createError(400, "Wrong password or username!"))


       const {password, isAdmin, ...otherDetails} = user._doc

       const token = jwt.sign({id:user._id, isAdmin:req.body.isAdmin, isCarer:req.body.isCarer}, process.env.JWT_SECRET, {}, (err, token) => {
        if(err) throw err;
        res.cookie("access_token", token,{httpOnly: true,}).status(200).json({...otherDetails})
        }
       )
        
    }catch(err){
        next(err);
    }
}


