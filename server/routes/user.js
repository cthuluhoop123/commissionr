const { Router } = require('express');
const router = Router();

const auth = require('../middleewares/authenticate.js');

const database = require('../../database/database.js');

router.get('/commissions', auth, async (req, res, next) => {
    const commissions = await database.getCommissions(req.user.id);
    res.json(commissions);
});

router.post('/createCommission', auth, async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        res
            .status(400)
            .json({ error: 'Please specify a commission name.' });
        return;
    }
    const commission = await database.createCommission({
        id: req.user.id,
        name: name
    });
    res.json(commission);
});

module.exports = router;