import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * handles async errors that could occur in the controller
 * @param {function} fn - the controller function
 * @returns {function} - the controller function
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Checks if the password matches the hashed password
 * @param {string} password - the password to check
 * @returns {boolean} - true if the password matches the hashed password
 */
export const checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generates a jwt for the user
 * @param {String} userId - the users id
 * @returns {String} - the jwt token
 */
export const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
};

/**
 * Generates the users refresh token
 * @param {String} userId - the users id
 * @returns {String} - the refresh token
 */
export const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '4d' });
};

/**
 * Verifies the JWT token
 * @param {String} token 
 * @returns {Object} - the decoded token { userId: String, iat: Number, exp: Number }
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
