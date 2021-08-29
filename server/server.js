const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const auth = require('./routes/auth.js');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(helmet());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use('/auth', auth);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message
    });
});

app.listen(process.env.PORT, () => console.log('Running on', process.env.PORT));
