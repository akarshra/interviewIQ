import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:false // Optional for Google Auth users
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    credits:{
        type:Number,
        default:1000
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastInterviewDate: {
        type: Date,
        default: null
    },
    badges: {
        type: [String],
        default: []
    }

}, {timestamps:true})

const User = mongoose.model("User" , userSchema)

export default User