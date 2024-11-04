const express = require('express');
const authorization = require('../middleware/authorization')
const {
    getStreaks,
    createNewStreak,
    incrementStreak,
    newRound,
    retryStreak,
    deleteStreak
} = require('../controllers/streakController')
  
const router = express.Router();

router.use(authorization)

router.get('/getStreaks', getStreaks);

router.put('/newStreaks', createNewStreak);

router.put('/incrementStreak', incrementStreak);

router.put('/roundEnded', newRound);

router.put('/retryStreak', retryStreak);

router.put('/deleteStreak', deleteStreak);

module.exports = router;