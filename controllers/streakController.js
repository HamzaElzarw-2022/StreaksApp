const {streak, streakObject} = require('../models/streak')

const getStreaks = async (req, res) => 
{
    const streaks = await streak.find({});
    res.status(200).json(streaks);
} 

//TODO add try catch and change res.json according to error
const createNewStreak = async (req, res) => 
{
    const newStreak = await streak.create(new streakObject(req.body.name, req.body.theme, req.body.roundUpdateTime));
    res.json(newStreak);
}

const incrementStreak = async (req, res) => 
{
    const id = req.body.id;
    const document = await streak.findById(id);

    if(!document) 
        return res.json({
            status: false,
            message: "streak id not found"
        })
    if(!document.active)
        return res.json({
            status: false,
            message: "streak is not active"
        });
    if(document.done)
        return res.json({
            status: false,
            message: "streak is already done"
        });
    await streak.findByIdAndUpdate(id, {
        done: true,
        $inc: { count: 1 }
    })
    return res.json({
        status: true,
        message: "success"
    });

}

const newRound = async (req, res) => 
{
    const DAY = 86430000;
    const id = req.body.id;
    const document = await streak.findById(id);

    if(!document) 
        return res.json({
            status: false,
            message: "streak id not found"
        })
    if(!document.active)
        return res.json({
            status: false,
            message: "an expired streak requested a new round, please refresh your page"
        });
    if(!document.done || (Date.now() - new Date(document.roundEnd)) > DAY) { //streak deadline has passed
        
        const newHighestStreak = (document.count > document.highestStreak) ? document.count : document.highestStreak;

        const expiredStreak = await streak.findByIdAndUpdate(req.body.id, {
            active: false,
            done: false,
            highestStreak: newHighestStreak
        })
    
        return res.json({
            status: true,
            action: "expired",
            message: "deadline has passed!!",
            streak: expiredStreak
        });
    }

    const newRoundEnd = new Date(document.roundEnd.setDate(document.roundEnd.getDate()+1));
    await streak.findByIdAndUpdate(req.body.id, {
        done: false,
        roundEnd: newRoundEnd,
    })
    return res.json({
        status: true,
        action: "active",
        message: "new round started",
        newRoundEnd: newRoundEnd
    });
}

const retryStreak = async (req, res) => 
{
    const id = req.body.id;
    const document = await streak.findById(id);
    const updateTime = document.roundEnd.getHours();

    if(!document) 
        return res.json({
            status: false,
            message: "streak id not found"
        })
    if(document.active)
        return res.json({
            status: false,
            message: "streak is already active"
        });

    let newRoundEnd = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), updateTime)
    if(updateTime <= new Date().getHours()) 
        newRoundEnd.setDate(new Date().getDate()+1);

    const activatedStreak = await streak.findByIdAndUpdate(req.body.id, {
        done: false,
        active: true,
        count: 0,
        $inc: { numberOfAttempts: 1 },
        roundEnd: newRoundEnd
    }, {new: true})
    return res.json({
        status: true,
        streak: activatedStreak
    })
}

const deleteStreak = async (req, res) => 
{
    const deletedStreak = await streak.findByIdAndDelete(req.body.id);

    if(!deletedStreak)
        return res.json({
            status: false,
            message: "streak not found"
        })
    
    return res.json({
        status: true,
        message: "streak was deleted"
    })

}

module.exports = {
    getStreaks,
    createNewStreak,
    incrementStreak,
    newRound,
    retryStreak,
    deleteStreak
}