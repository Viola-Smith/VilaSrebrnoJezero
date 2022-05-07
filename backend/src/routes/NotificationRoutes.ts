import express from 'express';
import NotificationService from '../services/NotificationService';

const router = express.Router();



router.route('/').get(async (req, res) => {
  res.json(await NotificationService.getAll())
});


router.route('/:notifId').put(async (req, res) => {
  let notifId = req.params.notifId
  let notif = req.body.notif
  res.json(await NotificationService.update(notifId, notif))
});

module.exports = router;