import express from 'express';
import CalendarService from '../services/CalendarService';

const router = express.Router();


router.route('/authorize').post(async (req, res) => {
    let redirectUri = req.body.redirectUri
    console.log(redirectUri)
    res.json(await CalendarService.authorizeUser(redirectUri))
});

router.route('/connect').post(async (req, res) => {
    let code = req.body.code
    let redirectUri = req.body.redirectUri
    console.log(code)
    console.log(redirectUri)
    res.json(await CalendarService.createAccessToken(code, redirectUri))
});

router.route('/disconnect').get(async (req, res) => {
    res.json(await CalendarService.disconnectUser())
});

router.route('/token').get(async (req, res) => {
    res.json(await CalendarService.getToken())
});

module.exports = router;