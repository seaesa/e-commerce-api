import HttpError from '../../services/httpErrorService.js';
import AuthService from '../../services/dbServices/authService.js';

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const response = await AuthService.loginLogic(email, password);
    res.json({ status: 'success', message: 'Logged in successfully', data: response });
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }
};
const register = async (req, res, next) => {
  try {
    const response = await AuthService.registerLogic(req.body);
    res.json({ status: 'success', message: 'Logged in successfully', data: response });
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }
};

const forgotPassword = async (req, res, next) => {
};

const resetPassword = async (req, res, next) => {
};

const refreshTokens = async (req, res, next) => {
};

const sendVerificationEmail = async (req, res, next) => {
};

const logout = async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  //   res.send() ==== this is for production
  res.status(StatusCodes.OK).json({ msg: "user logged out!" }) // this is for testing during development
};

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
  refreshTokens,
  sendVerificationEmail,
  logout
};
