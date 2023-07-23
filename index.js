const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const {streak, streakObject} = require('./streak')

const port = 8080;
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mainDB')
.then(()=>{
  console.log("connected to DB")
  app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
  })
}).catch((err) => {
  console.log(err)
})

//get saved streaks
app.get('/getStreaks', (req, res) => {

  streak.find({})
    .then( result => {res.json(result);})
    .catch(error => {console.log(error)})

})

//create a new streak
app.put('/newStreaks',  (req, res) => {

  console.log("newStreak recieved");
  const newStreak = new streak(new streakObject(req.body.name, req.body.theme, req.body.roundUpdateTime));

  newStreak.save().then(()=>{
    res.json(newStreak);
  }).catch(error =>{
    console.log(error)
  })
})

app.put('/incrementStreak',  (req, res) => {

  console.log("incrementStreak recieved");

  streak.findById(req.body.id).then( document => {

    // console.log(document)

    if(document == null) {
      res.json({
        status: false,
        meassage: "streak id not found"
      })
    }
    else if(document.done == false && document.active == true) {
      
      streak.findByIdAndUpdate(req.body.id, {
        done: true,
        $inc: { count: 1 }
      }).then( () => {
        res.json({
          status: true,
          meassage: "success"
        });
      })
    }
    else {
      res.json({
        status: false,
        meassage: "streak is not active or already done"
      });
    }
  
  }).catch( error => {
    console.log(error)
    res.json({
      status: false,
      meassage: "DB error"
    });
  })
  
})

app.put('/roundEnded',  (req, res) => {

  console.log("round end recieved");

  streak.findById(req.body.id).then( document => {

    if(document == null) {
      res.json({
        status: false,
        meassage: "streak id not found"
      })
    }
    else if(document.active) {

      let newHighestStreak = document.highestStreak;
      if(document.count > newHighestStreak)
        newHighestStreak = document.count;

      //check that streak is done and only less than 24h has passed since last deadline
      if(document.done && (Date.now() - new Date(document.roundEnd)) < 86430000) 
      {
        const newRoundEnd = new Date(document.roundEnd.setDate(document.roundEnd.getDate()+1));

        streak.findByIdAndUpdate(req.body.id, {
          done: false,
          roundEnd: newRoundEnd,
          highestStreak: newHighestStreak
        }).then( () => {
          res.json({
            status: true,
            action: "active",
            message: "new round started",
            newRoundEnd: newRoundEnd
          });
        })
      }
      else { //streak deadline has passed
        streak.findByIdAndUpdate(req.body.id, {
          active: false,
          done: false,
          highestStreak: newHighestStreak
        }).then( () => {
          res.json({
            status: true,
            action: "expired",
            message: "deadline has passed!!"
          });
        })
      }

    }
    else { //streak is not active
      res.json({
        status: false,
        meassage: "streak is not active"
      });
    }

  }).catch(error => {
    console.log(error)
    res.json({
      status: false,
      meassage: "DB error"
    })
  })
  
})

app.put('/retryStreak',  (req, res) => {
  console.log("retry streak")

  streak.findById(req.body.id).then( document => {

    if(document == null) 
    {
      res.json({
        status: false,
        meassage: "streak id not found"
      })
    }
    else if(!document.active) 
    {
      let newRoundEnd = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), document.roundEnd.getHours())
      if(document.roundEnd.getHours() <= new Date().getHours()) 
        newRoundEnd.setDate(new Date().getDate()+1);

      streak.findByIdAndUpdate(req.body.id, {
        done: false,
        active: true,
        count: 0,
        $inc: { numberOfAttempts: 1 },
        roundEnd: newRoundEnd
      }).then( async () => {
        res.json({
          status: true,
          streak: await streak.findById(req.body.id)
        })
      })
    }
    else 
    {
      res.json({
        status: false,
        meassage: "streak is already active"
      })
    }
  })
})

app.put('/deleteStreak',  (req, res) => {
  console.log("delete streak recieved")
  
  streak.findByIdAndDelete(req.body.id).then((document)=>{
    if(document == null) {
      res.send({
        status: false,
        message: "streak not found"
      })
      return;
    }
    res.send({
      status: true,
      message: "streak was deleted"
    })

  }).catch(error => {
    console.log(error)
    res.send({
      status: false,
      message: "DB error"
    })
  })
  
})

//allow access
app.options('/allowCors', () => {
  console.log("OPTION recieved")
});

//all print
app.all('*', (req) => {
  console.log("request at All methode: " + req.method + " URL " + req.url);
});