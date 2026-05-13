import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not set");
    }

    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"7d"});
        return token;
    } catch (error) {
        console.error("Token generation error:", error.message);
        throw error;
    }
}

export default genToken
