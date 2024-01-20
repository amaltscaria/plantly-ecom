import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs'; 
import nodemailer from 'nodemailer';
import Otp from '../model/Otp.js';


//nodemailer
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  
  //send otp verification mail
  export const sendOtpVerificationMail = async (userName,res) => {
    try {
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
      //mail options
      const mailOptions = {
        from: process.env.EMAIL,
        to: userName,
        subject: 'Verify Your Email',
        html: `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center;">

        <div style="max-width: 600px; margin: 30px auto; padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    
            <h2 style="color: #2ecc71;">Plantly Account Verification</h2>
    
            <p>Welcome to Plantly, your green oasis! 🌿</p>
    
            <p style="font-size: 16px; line-height: 1.6; color: #333;">To ensure the security of your account, please use the following verification code within the next 2 minutes:</p>
    
            <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; margin: 20px 0;">
                ${otp}
            </div>
    
            <p style="font-size: 16px; line-height: 1.6; color: #333;">If you didn't request this code or have any concerns, please contact our support team immediately.</p>
    
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for choosing Plantly! 🌱</p>
    
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 10px;">Note: This is an automated message. Please do not reply.</p>
    
        </div>
    
    </body>`,
      };
      // hash the otp
      const saltRounds = 10;
      const hashedOtp = await bcrypt.hash(otp, saltRounds);
      const newOtp = new Otp({
        userName,
        otp: hashedOtp,
      });
      // save otp to database
      await newOtp.save();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      res.json({
        status: 'FAILED',
        message: error.message,
      });
    }
  };
  