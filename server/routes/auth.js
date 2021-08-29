const { Router } = require('express');
const router = Router();

const database = require('../../database/database.js');
const { UniqueViolationError } = require('objection');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    const { email, artistName, password } = req.body;
    if (!email || !artistName || !password) {
        res.status(400).json({
            error: 'Missing email/artist name/password'
        });
        return;
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await database.registerUser({ email, artistName, passwordHash: hash });
        const userPayload = { id: user.id, email: user.email, artistName: user.artist_name };
        jwt.sign(userPayload, process.env.JWT_SECRET, (err, token) => {
            if (err) { throw err; }

            res
                .cookie('token', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days lol
                })
                .json(userPayload);
        });
    } catch (err) {
        if (err instanceof UniqueViolationError) {
            err.status = 400;
            err.message = 'Email already exists.';
            next(err);
            return;
        }
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: 'Missing email/password'
            });
            return;
        }
        const user = await database.getUser({ email });
        if (!user) {
            res.status(401).json({
                error: 'Wrong password.'
            });
            return;
        }
        const userPayload = { id: user.id, email: user.email, artistName: user.artist_name };
        const correctPassword = await bcrypt.compare(password, user.password_hash);

        if (correctPassword) {
            jwt.sign(userPayload, process.env.JWT_SECRET, (err, token) => {
                if (err) { throw err; }

                res
                    .cookie('token', token, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days lol
                    })
                    .json(userPayload);
            });
        } else {
            res.status(401).json({
                error: 'Wrong password.'
            });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;