import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
     question: String,
  difficulty: String,
  timeLimit: Number,
  answer: String,
  feedback: String,
  score: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },
  technical: { type: Number, default: 0 },
  problemSolving: { type: Number, default: 0 },
  analyticalLogic: { type: Number, default: 0 }
})


const interviewSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        enum:["Behavioral","Technical"],
        required:true
    },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        default: "Intermediate"
    },
    practiceMode: {
        type: Boolean,
        default: false
    },
    preferredLanguage: {
        type: String,
        default: "javascript"
    },
    template: {
        type: String,
        default: "General"
    },
    jobDescription:{
        type:String
    },
    resumeText:{
     type:String
    },
    personality: {
        type: String,
        default: "Professional and Balanced"
    },
    questions:[questionsSchema],

    finalScore: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Incompleted", "completed"],
      default: "Incompleted",
    }
},{timestamps:true})

const Interview = mongoose.model("Interview" , interviewSchema)


export default Interview