const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const auth = require('./routes/auth.js');
const user = require('./routes/user.js');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(helmet());
app.use(cookieParser());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use('/auth', auth);
app.use('/user', user);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message
    });
});

app.listen(process.env.PORT, () => console.log('Running on', process.env.PORT));