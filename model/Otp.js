import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  userName: String,
  otp: String,
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 60000) }, // Set to expire in 1 minute
});

const Otp = mongoose.model('Otp', OtpSchema);

export default Otp;
