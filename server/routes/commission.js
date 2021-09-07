const { Router } = require('express');
const router = Router();

const uuid = require('uuid').v4;

const AWS = require('aws-sdk');
AWS.config.update({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    },
    region: 'us-east-1'
});

const s3 = new AWS.S3();

const { UniqueViolationError, DataError } = require('objection');

const auth = require('../middleewares/authenticate.js');

const database = require('../../database/database.js');

router.get('/all', auth, async (req, res, next) => {
    const commissions = await database.getCommissions(req.user.id);
    res.json(commissions);
});

router.get('/', auth, async (req, res, next) => {
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

router.get('/track', async (req, res, next) => {
    const { trackingId } = req.query;
    if (!trackingId) {
        res.status(400).json({
            error: 'Missing tracking ID.'
        });
        return;
    }
    const commission = await database.getCommissionTracking(trackingId);
    if (!commission) {
        res.status(404).json({
            error: 'Not found'
        });
        return;
    }
    res.json(commission);
});

router.post('/create', auth, async (req, res, next) => {
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

router.post('/edit', auth, async (req, res, next) => {
    const { id, projectName, clientName, status } = req.body;
    if (
        !id
        || (!projectName && !clientName && !status)
    ) {
        res
            .status(400)
            .json({ error: 'Please include commission ID, new project name, and new client name.' });
        return;
    }

    try {
        if (!(await database.isCommissionOwner(req.user.id, id))) {
            res.status(401).json({
                error: 'Permission denied'
            });
            return;
        }
        const commission = await database.editCommission({
            id,
            projectName,
            clientName,
            status
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

router.get('/updates', auth, async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        res.status(400).json({
            error: 'Missing commission ID'
        });
        return;
    }

    if (!(await database.isCommissionOwner(req.user.id, id))) {
        res.status(401).json({
            error: 'Permission denied'
        });
        return;
    }

    const updates = await database.getUpdates(id);
    res.json(await keyToSignedUrl(updates));
});

router.get('/trackingUpdates', async (req, res, next) => {
    const { trackingId } = req.query;
    if (!trackingId) {
        res.status(400).json({
            error: 'Missing tracking ID'
        });
        return;
    }
    const updates = await database.getUpdatesTracking(trackingId);
    res.json(await keyToSignedUrl(updates));
});

router.get('/getSignedUrl', auth, async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        res.status(400).json({
            error: 'Missing update target ID.'
        });
        return;
    }
    const key = uuid();

    await database.addUpdateImage(id, key);

    s3.createPresignedPost({
        Bucket: 'commissionr',
        Fields: { key },
        Conditions: [['content-length-range', 100, 5 * 1000 * 1000]]
    }, (err, data) => {
        res.json(data);
    });
});

router.post('/createUpdate', auth, async (req, res, next) => {
    const { id, title, description, saveTitle } = req.body;
    if (!id) {
        res.status(400).json({
            error: 'Missing commission ID'
        });
        return;
    }

    if (!title) {
        res.status(400).json({
            error: 'Missing update title.'
        });
        return;
    }

    if (!(await database.isCommissionOwner(req.user.id, id))) {
        res.status(401).json({
            error: 'Permission denied'
        });
        return;
    }

    try {
        const update = await database.createUpdate({
            commissionId: id,
            title,
            description
        });

        if (saveTitle) {
            database.createUpdateTitle(req.user.id, title).catch(err => { });
        }

        res.json(update);
    } catch (err) {
        if (err instanceof DataError) {
            res.status(400).json({
                error: 'Your update must be less that 255 characters.'
            });
            return;
        }
        next(err);
    }
});

router.post('/createUpdateTitle', auth, async (req, res, next) => {
    const { title } = req.body;
    if (!title) {
        res.status(400).json({
            error: 'Invalid/missing update title.'
        });
        return;
    }

    const updateTitle = await database.createUpdateTitle(req.user.id, title);
    res.json(updateTitle);
});

router.get('/updateTitles', auth, async (req, res, next) => {
    res.json(await database.getUpdateTitles(req.user.id));
});

async function keyToSignedUrl(updates) {
    for (const update of updates) {
        if (update.images.length) {
            const signedUrls = await Promise.all(
                update.images.map(image => {
                    return s3.getSignedUrlPromise('getObject', {
                        Bucket: 'commissionr',
                        Key: image.key,
                        Expires: 60
                    });
                })
            );
            update.images = signedUrls;
        }
    }
    return updates;
}


module.exports = router;