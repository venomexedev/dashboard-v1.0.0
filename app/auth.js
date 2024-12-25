const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const axios = require('axios');
const fs = require('fs');
const randomstring = require("randomstring");
const router = express.Router();

const { db } = require('../function/db');
const { logError } = require('../function/logError')

const hydrapanel = {
  url: process.env.PANEL_URL,
  key: process.env.PANEL_KEY
};

// Configure passport to use Discord
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// hydrapanel account system
async function checkAccount(email, username, id) {
  try {
    // Check if user already exists in hydrapanel
    let response;
    try {
      response = await axios.post(`${hydrapanel.url}/api/getUser`, {
        type: 'email',
        value: email
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${hydrapanel.key}`
        }
      });
    
      // User already exists, log and return
      console.log('User already exists in hydrapanel. User ID:', response.data.userId);
      await db.set(`id-${email}`, response.data.userId);
      return;
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          // User does not exist
          console.log('User does not exist in hydrapanel');
          // You can handle actions here like returning an error or creating a new user
        } else if (err.response.status !== 404) {
          // Handle other HTTP errors
          logError('Failed to check user existence in hydrapanel', err);
          throw err;
        }
      } else {
        // Handle network or other non-response errors
        logError('Error during request to hydrapanel', err);
        throw err;
      }
    }    

    // Generate a random password for new user
    const password = randomstring.generate({ length: process.env.PASSWORD_LENGTH });

    // Create user in hydrapanel
    try {
      const response = await axios.get(`${hydrapanel.url}/api/auth/create-user`, {
        params: {
          username: username,
          email: email,
          password: password,
          userId: id
        },
        headers: {
          'x-api-key': `${hydrapanel.key}`
        }
      });

      // Log creation and set password in database
      await db.set(`password-${email}`, password);
      await db.set(`id-${email}`, response.data.userId);
      console.log('User created in HydraPanel');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        console.log('User creation conflict: User already exists in hydrapanel.');
      } else {
        logError('Failed to create user in hydrapanel', err);
        throw err;
      }
    }
  } catch (error) {
    logError('Error during account check', error);
    throw error;
  }
}

// Discord login route
router.get('/login/discord', passport.authenticate('discord'));

// Discord callback route
router.get('/callback/discord', passport.authenticate('discord', {
  failureRedirect: '/login'
}), (req, res) => {
  checkAccount(req.user.email, req.user.username, req.user.id)
    .then(() => res.redirect(req.session.returnTo || '/dashboard'))
    .catch(error => {
      logError('Error during account check', error);
      res.redirect('/dashboard');
    });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logError('Logout failed', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

module.exports = router;
