import dotenv from 'dotenv';
dotenv.config();
import { generate } from 'referral-codes';
import bcrypt from 'bcryptjs';
import Otp from '../../model/Otp.js';
import User from '../../model/User.js';
import crypto from 'crypto';
import ResetpasswordModel from '../../model/ResetPassword.js';
import { transporter, sendOtpVerificationMail } from '../../utils/sendOtp.js';
import { addMoneyToWallet } from '../payment/paymentController.js';
import Banner from '../../model/banner.js';

export const getHome = async (req, res) => {
  const banners = Banner.find({
    isListed: true,
    expiryDate: { $gt: new Date() },
  });
  res.render('user/auth/home', { banners });
};

export const getRegister = async (req, res) => {
  const referralCode = req.query.referral;
  res.render('user/auth/register', {referralCode});
};

export const postRegister = async (req, res) => {
  try {
    let referredUser = '';
    if (req.query.referral) {
      const referralCode = req.query.referral;
      referredUser = await User.findOne({ referralCode, isBlocked: false });
      if (!referredUser) {
        return res.status(404).json({ message: 'Invalid Referal Link' });
      }
    }
    const { firstName, lastName, email, password, number } = req.body;
    // check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({message: 'User with the given email exists already'});
    }
    req.session.user = email;
    req.session.userDetails = {
      firstName,
      lastName,
      email,
      password,
      number,
      referredBy: referredUser.email ?? '',
    };
    // Redirect to verification route
    return res.status(200).json({message:'Success'});
  } catch (err) {
    console.log(err);
  }
};

export const getLogin = async (req, res) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let successMessage = req.flash('success');
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  res.render('user/auth/login', {
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  //check user exists
  //if the user does not exist
  if (!user) {
    return res
      .status(404)
      .json({ message: 'User with given email id is not found' });
  }
  //if user exists
  const verified = await bcrypt.compare(password, user.password);
  if (verified) {
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.session.email = email;
    return res.status(200).json({ message: 'Succcess' });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const getVerify = async (req, res) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('user/auth/otp', { errorMessage: errorMessage });
};

export const postVerify = async (req, res) => {
  try {
    const inputOtp =
      req.body.digit1 +
      req.body.digit2 +
      req.body.digit3 +
      req.body.digit4 +
      req.body.digit5 +
      req.body.digit6;
    const user = await Otp.findOne({ userName: req.session.user });
    const { otp } = user;
    const verified = await bcrypt.compare(inputOtp, otp);
    if (verified) {
      console.log(req.session.userDetails);
      const { firstName, lastName, email, password, number, referredBy } =
        req.session.userDetails;
      const referalCode = generate({
        length: 6,
        count: 1,
        prefix: 'plantly',
        charset: email,
      });
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        number: number,
        password: hashedPassword,
        referredBy,
        referralCode: referalCode[0],
      });
      await newUser.save();
      req.session.email = email;
      if (referredBy) {
        await addMoneyToWallet(req.session.email, 100, 'Referred Signup');
        await addMoneyToWallet(referredBy, 200, 'Referral');
      }
      res.redirect('/home');
    } else {
      req.flash('error', 'Expired or Incorrect otp');
      return res.redirect('/verify');
    }
  } catch (err) {
    console.log(err);
  }
};

export const getSendOtp = async (req, res) => {
  await sendOtpVerificationMail(req.session.user, res);
  res.status(200).json({message:'Success'});
};

export const getForgotPassword = (req, res) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('user/auth/forgot', { errorMessage: errorMessage });
};

export const postForgotPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/forgotPassword');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/forgotPassword');
        }
        const resetPass = new ResetpasswordModel({
          userName: req.body.email,
          resetToken: token,
          expiresAt: Date.now() + 300000,
        });
        return resetPass.save();
      })
      .then(result => {
        if (result) {
          req.flash('success', 'Password Reset link sent successfully');
          res.redirect('/login');
          const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Password Reset',
            html: `<p> You requested a password reset</p>
          <p> Click this <a href = "http://localhost:3000/resetPassword/${token}" >Link</a> to set a new Password.</p>`,
          };
          transporter.sendMail(mailOptions);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
};

export const getResetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await ResetpasswordModel.findOne({
      resetToken: token,
      expiresAt: { $gt: Date.now() },
    });
    if (user) {
      let errorMessage = req.flash('error');
      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }
      let successMessage = req.flash('error');
      if (successMessage.length > 0) {
        successMessage = successMessage[0];
      } else {
        successMessage = null;
      }
      req.session.userName = user.userName;
      res.render('user/auth/reset', {
        errorMessage: errorMessage,
        successMessage: successMessage,
        passwordToken: token,
      });
    }
  } catch (err) {
    console.log('expired');
    console.log(err);
  }
};
export const postResetPassword = async (req, res) => {
  const { password, confirmPassword, passwordToken } = req.body;
  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect(`/resetPassword/${passwordToken}`);
  }
  // Find the resetData using the resetToken taken from the hidden input field
  const resetData = await ResetpasswordModel.findOne({
    resetToken: passwordToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!resetData) {
    req.flash('error', 'Invalid or expired password reset token');
    return res.redirect(`/forgotPassword}`);
  }
  // Find the user name based on the username from reset collection
  const user = await User.findOne({ email: resetData.userName });
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect(`/forgotPassword}`);
  }
  //If user found update the users password
  user.password = await bcrypt.hash(password, 12);
  await user.save();
  // Redirect to the login page or any other appropriate page
  req.flash(
    'success',
    'Password reset successful. You can now login with your new password.'
  );
  res.redirect('/login');
};

export const getLogout = async (req, res) => {
  try {
    req.session.email = null;
    res.redirect('/home');
  } catch (err) {
    res.status(500).json({ error: 'Internal Sever Error' });
  }
};
