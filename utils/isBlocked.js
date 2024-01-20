import User from '../model/User.js';
export const isUserBlocked = async id => {
  const user = await User.findOne({ email: id });
  return user.isBlocked;
};
