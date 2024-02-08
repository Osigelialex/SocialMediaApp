import passportJWT from 'passport-jwt';
import passport from 'passport';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const config = process.env;
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload.id });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;