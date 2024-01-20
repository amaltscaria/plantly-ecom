import mongoose from 'mongoose';

const ResetPasswordSchema = mongoose.Schema({
  userName: String,
  resetToken: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 300000) }, // Set to expire in 1 minute
});

ResetPasswordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const ResetpasswordModel = mongoose.model('ResetPassWord', ResetPasswordSchema);

export default ResetpasswordModel;
