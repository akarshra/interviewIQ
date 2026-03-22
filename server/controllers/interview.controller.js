import fs from "fs"
import pdfParse from "pdf-parse";
import { askAi } from "../services/openRouter.service.js";
import { sendInterviewReportEmail } from "../services/email.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

// AI Gap Analysis Controller
export const analyzeGap = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Resume text and Job Description are required." });
    }

    const messages = [
      {
        role: "system",
        content: `You are an expert technical recruiter and resume reviewer.
Compare the Candidate's Resume against the Target Job Description.
Output a strict JSON object:
{
  "matchPercentage": number (0-100),
  "strengths": ["match 1", "match 2", "match 3"],
  "missingKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "redFlags": ["red flag 1", "red flag 2"]
}
Be critical, realistic, and brutally honest. Keep array items strictly under 15 words each. Do not output markdown code blocks formatting, just raw JSON text starting with { and ending with }.`
      },
      {
        role: "user",
        content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`
      }
    ];

    let aiResponse = await askAi(messages);
    let parsed;
    try {
      const jsonText = extractJsonObject(aiResponse) || aiResponse;
      parsed = JSON.parse(jsonText);
    } catch {
      // Second strict attempt
      aiResponse = await askAi([...messages, { role: "system", content: "You must solely literally output JSON."}]);
      const jsonText2 = extractJsonObject(aiResponse) || aiResponse;
      parsed = JSON.parse(jsonText2);
    }

    res.json(parsed);
  } catch (error) {
    console.error("Gap Analysis error:", error);
    return res.status(500).json({ message: "An internal server error occurred during gap analysis." });
  }
}

import Interview from "../models/interview.model.js";

function extractJsonObject(text) {
  if (!text || typeof text !== "string") return null;
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  return text.slice(first, last + 1);
}

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }
    const filepath = req.file.path

    const fileBuffer = await fs.promises.readFile(filepath)
    
    // Use pdf-parse instead of pdfjs-dist for reliable Node.js parsing
    const pdfData = await pdfParse(fileBuffer);
    let resumeText = pdfData.text;

    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
      },
      {
        role: "user",
        content: resumeText
      }
    ];


    let aiResponse = await askAi(messages)
    let parsed;
    try {
      const jsonText = extractJsonObject(aiResponse) || aiResponse;
      parsed = JSON.parse(jsonText);
    } catch {
      aiResponse = await askAi([
        ...messages,
        { role: "system", content: "Return ONLY valid JSON. No markdown, no extra text." },
      ]);
      const jsonText = extractJsonObject(aiResponse) || aiResponse;
      parsed = JSON.parse(jsonText);
    }

    fs.unlinkSync(filepath)


    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText
    });

  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: "An internal server error occurred during resume analysis." });
  }
};


export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({ message: "Role, Experience and Mode are required." })
    }

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required."
      });
    }

    const projectText = Array.isArray(projects) && projects.length
      ? projects.join(", ")
      : "None";

    const skillsText = Array.isArray(skills) && skills.length
      ? skills.join(", ")
      : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillsText},
    Resume:${safeResume}
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is empty."
      });
    }

    const messages = [

      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`
      }
      ,
      {
        role: "user",
        content: userPrompt
      }
    ];


    const aiResponse = await askAi(messages)

    if (!aiResponse || !aiResponse.trim()) {
           
      return res.status(500).json({
        message: "AI returned empty response."
      });

    }

    const questionsArray = aiResponse
      .split("\n")
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      
      return res.status(500).json({
        message: "AI failed to generate questions."
      });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      }))
    })

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions
    });
  } catch (error) {
    console.error("Generate question error:", error);
    return res.status(500).json({message: "An internal server error occurred while creating interview."})
  }
}


export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body
    if (!interviewId) {
      return res.status(400).json({ message: "interviewId is required" });
    }
    if (typeof questionIndex !== "number" || Number.isNaN(questionIndex)) {
      return res.status(400).json({ message: "questionIndex must be a number" });
    }

    const interview = await Interview.findById(interviewId)
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    if (!Array.isArray(interview.questions) || !interview.questions[questionIndex]) {
      return res.status(400).json({ message: "Invalid questionIndex" });
    }
    const question = interview.questions[questionIndex]

    // If no answer
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.json({
        feedback: question.feedback
      });
    }

    // If time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await interview.save();

      return res.json({
        feedback: question.feedback
      });
    }


    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`
      }
      ,
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${answer}
`
      }
    ];


    let aiResponse = await askAi(messages)
    let parsed;
    try {
      const jsonText = extractJsonObject(aiResponse) || aiResponse;
      parsed = JSON.parse(jsonText);
    } catch {
      aiResponse = await askAi([
        ...messages,
        { role: "system", content: "Return ONLY valid JSON. No markdown, no extra text." },
      ]);
      const jsonText = extractJsonObject(aiResponse) || aiResponse;
      parsed = JSON.parse(jsonText);
    }

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    await interview.save();


    return res.status(200).json({feedback :parsed.feedback})
  } catch (error) {
    console.error("Submit answer error:", error);
    return res.status(500).json({message: "An internal server error occurred while submitting answer."})

  }
}


export const finishInterview = async (req,res) => {
  try {
    const {interviewId} = req.body
    if (!interviewId) {
      return res.status(400).json({ message: "interviewId is required" });
    }
    const interview = await Interview.findById(interviewId)
    if(!interview){
      return res.status(404).json({message:"Interview not found"})
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions
      ? totalScore / totalQuestions
      : 0;

    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    // V2 Feature: Gamification Streak System
    const user = await User.findById(req.userId);
    if (user) {
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD reliably

        let lastDateStr = null;
        if (user.lastInterviewDate) {
            lastDateStr = user.lastInterviewDate.toISOString().split("T")[0];
        }

        if (!lastDateStr) {
            // First ever interview
            user.currentStreak = 1;
            user.longestStreak = 1;
            user.lastInterviewDate = now;
        } else if (lastDateStr !== todayStr) {
            // Not today, let's check if it was exactly yesterday
            const todayDate = new Date(todayStr);
            const lastDate = new Date(lastDateStr);
            const diffTime = Math.abs(todayDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
                // Perfect, streak continues!
                user.currentStreak += 1;
                if (user.currentStreak > user.longestStreak) {
                    user.longestStreak = user.currentStreak;
                }
                user.lastInterviewDate = now;
            } else if (diffDays > 1) {
                // Missed a day, streak broken
                user.currentStreak = 1;
                user.lastInterviewDate = now;
            }
        }
        // If lastDateStr === todayStr, they already did one today, streak stays the same.
        
        await user.save();
    }

    if (user && user.email) {
        // Fire and forget background execution to ensure 0 UI lag
        sendInterviewReportEmail(
            user.email,
            user.name,
            interview.role,
            Number(finalScore.toFixed(1)),
            interview._id
        ).catch(err => console.error("Async email dispatch failed:", err));
    }

    return res.status(200).json({
       finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
      streakUpdated: user ? user.currentStreak : 0
    })
  } catch (error) {
    console.error("Finish interview error:", error);
    return res.status(500).json({message: "An internal server error occurred while finishing interview."})
  }
}


export const getMyInterviews = async (req,res) => {
  try {
    const interviews = await Interview.find({userId:req.userId})
    .sort({ createdAt: -1 })
    .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews)

  } catch (error) {
     console.error("Get my interviews error:", error);
     return res.status(500).json({message: "An internal server error occurred while getting interviews."})
  }
}

export const getInterviewReport = async (req,res) => {
  try {
    const interview = await Interview.findById(req.params.id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }


    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });
    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

       return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions
    });

  } catch (error) {
    console.error("Get interview report error:", error);
    return res.status(500).json({message: "An internal server error occurred while finding interview report."})
  }
}




