import genToken from "../config/token.js"
import User from "../models/user.model.js"


import bcrypt from "bcryptjs";

export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name , 
                email
            })
        }
        let token = await genToken(user._id)
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json(user)



    } catch (error) {
        console.error("Google auth error:", error);
        return res.status(500).json({message: "An internal server error occurred during Google authentication."})
    }
    
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        let token = await genToken(user._id);
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        // Don't send back the password
        user.password = undefined; 
        return res.status(201).json(user);

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "An internal server error occurred during registration." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if(!user.password) {
            return res.status(400).json({ message: "Please continue with Google, you registered via OAuth." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        let token = await genToken(user._id);
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        user.password = undefined; 
        return res.status(200).json(user);

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "An internal server error occurred during login." });
    }
};

export const logOut = async (req,res) => {
    try {
        const isProd = process.env.NODE_ENV === "production";
        await res.clearCookie("token", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
        });
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         console.error("Logout error:", error);
         return res.status(500).json({message: "An internal server error occurred during logout."})
    }
    
}