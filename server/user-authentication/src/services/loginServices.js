import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import generateToken from "../../../shared/utils/generateToken.js";
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(
  new Strategy(
    {
      clientID: process.env.GCLIENTID,
      clientSecret: process.env.GCLIENTSECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
//login code
const login = async (req, res) => {
  console.log("enetred at the login");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      console.log(user);
      bcrypt
        .compare(password, user.password)
        .then(function (result) {
          if (result) {
            generateToken(res, user._id);
            res.status(200).json("authenticated");
          } else {
            res.json("invalid password");
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (err) throw err;
        });
    }
  } catch (err) {
    if (err) throw err;
    res.json(err.message);
  }
};
//google Oauth
const Oauth = async (req, res) => {
  try {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res);
  } catch (err) {
    if (err) throw err;
  }
};

//google auth callback
const googleCallBack = (req, res) => {
  try {
    passport.authenticate(
      "google",
      { failureRedirect: "/" },
      async (err, user) => {
        if (err) {
          return res.status(500).json("Authentication failed");
        }
        if (!user) {
          return res.status(401).json("User not authenticated");
        }
        const email = user.email;
        const userExits = await User.findOne({ email });
        if (!userExits) {
          const user = await User.create({ email });
          console.log(user);
          if (user) {
            console.log("created succesfully");
          } else {
            res.status(400).json("invalid user data");
            return;
          }
        }
        return res.status(200).json("Google authentication successful");
      }
    )(req, res);
  } catch (err) {
    if (err) throw err;
  }
};
const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json("user logged out successfully");
  } catch (err) {
    if (err) throw err;
  }
};

export { login, Oauth, googleCallBack, logout };
