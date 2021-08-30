const { Router } = require('express');
const router = Router();

const { UniqueViolationError } = require('objection');

const auth = require('../middleewares/authenticate.js');

const database = require('../../database/database.js');

router.get('/commissions', auth, async (req, res, next) => {
    const commissions = await database.getCommissions(req.user.id);
    res.json(commissions);
});

router.get('/commission', auth, async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        res.status(400).json({
            error: 'Missing ID.'
        });
        return;
    }
    const commission = await database.getCommission(id);
    if (!commission) {
        res.status(404).json({
            error: 'Not found'
        });
        return;
    }
    if (commission.user_id !== req.user.id) {
        res.status(401).json({
            error: 'You do not have permission to see this commission.'
        });
        return;
    }
    res.json(commission);
});

router.post('/createCommission', auth, async (req, res, next) => {
    const { projectName, clientName } = req.body;
    if (!projectName || !clientName) {
        res
            .status(400)
            .json({ error: 'Please specify a commission and client name.' });
        return;
    }

    try {
        const commission = await database.createCommission({
            id: req.user.id,
            projectName,
            clientName
        });
        res.json(commission);
    } catch (err) {
        if (err instanceof UniqueViolationError) {
            res.status(400).json({
                error: 'A project with that name already exists.'
            });
            return;
        }
        next(err);
    }
});

router.post('/editCommission', auth, async (req, res, next) => {
    const { id, projectName, clientName } = req.body;
    if (!id || !projectName || !clientName) {
        res
            .status(400)
            .json({ error: 'Please include commission ID, new project name, and new client name.' });
        return;
    }

    try {
        const commission = await database.editCommission({
            id,
            projectName,
            clientName
        });
        res.json(commission);
    } catch (err) {
        if (err instanceof UniqueViolationError) {
            res.status(400).json({
                error: 'A project with that name already exists.'
            });
            return;
        }
        next(err);
    }
});

module.exports = router;