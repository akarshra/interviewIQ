import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL || "mock@gmail.com",
        pass: process.env.SMTP_PASSWORD || "mock_password"
    }
});

export const sendInterviewReportEmail = async (userEmail, userName, role, score, reportId) => {
    try {
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.log("Mock Email Service: Email not drafted because SMTP credentials are not configured in .env");
            return false;
        }

        const reportLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/report/${reportId}`;

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: userEmail,
            subject: `Your AI Interview Report - ${role}`,
            html: `
                <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #0E0E10; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
                    <div style="background: linear-gradient(135deg, #4f46e5, #0ea5e9); padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; color: #ffffff;">InterviewIQ.AI</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px; color: #e2e8f0;">Performance Report Available</p>
                    </div>
                    
                    <div style="padding: 40px 30px;">
                        <h2 style="margin-top: 0; font-size: 22px; color: #ffffff;">Hi ${userName},</h2>
                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Your AI-driven mock interview for the <strong style="color: #ffffff;">${role}</strong> position has been successfully analyzed.</p>
                        
                        <div style="background: #15151A; border: 1px solid #333; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
                            <p style="margin: 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Overall Capability Score</p>
                            <h3 style="margin: 10px 0 0; font-size: 48px; color: ${score >= 70 ? '#10b981' : (score >= 50 ? '#f59e0b' : '#ef4444')}; font-weight: 900;">${score}/100</h3>
                        </div>

                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Our advanced forensic AI engine has evaluated your theoretical logic, communication fluidity, and absolute correctness. Log into your dashboard to view the full multidimensional radar gap analysis.</p>

                        <div style="text-align: center; margin-top: 40px;">
                            <a href="${reportLink}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">View Full Breakdown</a>
                        </div>
                    </div>
                    
                    <div style="background: #000000; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
                        <p style="margin: 0;">© ${new Date().getFullYear()} InterviewIQ.AI Platform. All rights reserved.</p>
                        <p style="margin: 5px 0 0;">This is an automated performance report. Please do not reply.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Report email dispatched securely to ${userEmail}`);
        return true;
    } catch (error) {
        console.error("Critical failure inside Email Controller:", error);
        return false;
    }
};
