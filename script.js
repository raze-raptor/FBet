const express = require('express');
const axios = require('axios');
const session = require('express-session');

const app = express();
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const clientID = 'YOUR_DISCORD_CLIENT_ID';
const clientSecret = 'YOUR_DISCORD_CLIENT_SECRET';
const redirectURI = 'YOUR_REDIRECT_URI';
const tokenURL = 'https://discord.com/api/oauth2/token';
const userInfoURL = 'https://discord.com/api/users/@me';

// Discord OAuth2 callback
app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;

    const tokenParams = {
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectURI,
        scope: 'identify email'
    };

    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post(tokenURL, null, {
            params: tokenParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Fetch user data from Discord API
        const userInfoResponse = await axios.get(userInfoURL, {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`
            }
        });

        // Store user data in session
        req.session.user = userInfoResponse.data;

        // Redirect to the main game page
        res.redirect('/game');
    } catch (error) {
        console.error('Error during Discord OAuth2 callback:', error);
        res.redirect('/');
    }
});

// Game page route (check if user is authenticated)
app.get('/game', (req, res) => {
    if (req.session.user) {
        // User is authenticated, render the game page
        // You can access user data from req.session.user
        const user = req.session.user;
        res.send(`Welcome, ${user.username}! Balance: ${user.balance} FBux | Level: ${user.level} | XP: ${user.xp}`);
    } else {
        // User is not authenticated, redirect to the homepage
        res.redirect('/');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
