const { Router } = require('express');
const router = Router();

const { UniqueViolationError } = require('objection');

const auth = require('../middleewares/authenticate.js');

const database = require('../../database/database.js');

router.get('/', auth, async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        res.status(400).json({
            error: 'Missing user ID.'
        });
        return;
    }
    const user = await database.getUser({ id }, true);
    res.json(user);
});

module.exports = router;