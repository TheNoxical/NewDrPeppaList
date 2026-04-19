const express = require('express');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();
const session = require('express-session');
const axios = require('axios');
const pgSession = require('connect-pg-simple')(session);

const app = express();



const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});
db.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error: ' + err);
    } else {
        console.log('Database connected successfully!');
        release();
    }
});

app.use(express.json());

app.use(session({
    store: new pgSession({
        pool: db,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none'
    }
}));

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.get('/auth/discord', (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: 'identify email'
    });
    res.redirect(`https://discord.com/oauth2/authorize?${params}`);
});

app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = tokenRes.data;

        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });


        const { id, username, email, avatar } = userRes.data;

        const { rows } = await db.query(`
            INSERT INTO users (discord_id, username, email, avatar)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (discord_id) DO UPDATE
                SET username = EXCLUDED.username,
                    email = EXCLUDED.email,
                    avatar = EXCLUDED.avatar
            RETURNING *
            `, [id, username, email, avatar]);


            req.session.user = rows[0];
            if (!rows[0].display_name) {
                res.redirect(`${process.env.CLIENT_URL}/setup`);
            } else {
                res.redirect(process.env.CLIENT_URL);  
            }

            

    } catch (err) {
        console.log("Error on callback", err);
        res.status(500).json({ error: 'Authentication failed' });
    }
});


app.get('/api/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    res.json(req.session.user);
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect(process.env.CLIENT_URL);
})

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});


app.post('/api/setup', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    try {
        const { display_name } = req.body;

        if (!display_name || display_name.trim() === '') {
            return res.status(400).json({ error: 'Display name is required' });
        }

        const { rows } = await db.query(`
            UPDATE users SET display_name = $1 WHERE id = $2 RETURNING *
            `, [display_name, req.session.user.id]);

        req.session.user = rows[0];

        console.log('Session user set:', req.session.user);
        console.log('Session ID:', req.session.id);

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
            } else {
                console.log('Session saved successfully');
            }
            if (!rows[0].display_name) {
                res.redirect(`${process.env.CLIENT_URL}/setup`);
            } else {
                res.redirect(process.env.CLIENT_URL);
            }
        });

        res.json(rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to save username' });
    }
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

const PORT = process.env.PORT || 3001;

console.log('Attempting to listen on port:', PORT);

app.listen(process.env.PORT || 3001, '0.0.0.0', () => console.log('Server running'));