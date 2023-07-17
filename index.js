const express = require('express');
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser')
const port = 8080;

class streakObject 
{
  constructor(id, name, theme, roundUpdateTime) {
    this.id= id;
    this.name= name;
    this.theme= theme;

    this.count= 0;
    this.highestStreak = 0;
    this.numberOfAttempts = 1;
    this.dateCreated= new Date();
    this.roundEnd = new Date();
    
    this.done= false;
    this.active= true;
    
    
    if(this.dateCreated.getHours() >= roundUpdateTime);
     this.roundEnd.setDate(this.dateCreated.getDate()+1);
    
    // this.roundEnd.setDate(14);
    this.roundEnd.setHours(roundUpdateTime);
    this.roundEnd.setMinutes(0);  //------------------------------------------------------------------------------
    this.roundEnd.setSeconds(0);
    this.roundEnd.setMilliseconds(0);
    
    this.dateCreated= this.dateCreated.toString();

  }
}

let firstStreak = new streakObject(0, "days using streakApp", 0, 10); //--------------------------------------------

let streaksList = [firstStreak]; 

app.use(cors());
app.use(express.json());

//get saved streaks
app.get('/getStreaks', (req, res) => {
  res.send(JSON.stringify(streaksList));
})

//create a new streak
app.put('/newStreaks',  (req, res) => {

  console.log("newStreak recieved");
  console.log(req.body);
  const newStreak = new streakObject(streaksList.length, req.body.name, req.body.theme, req.body.roundUpdateTime);
  console.log(newStreak);
  streaksList.push(newStreak);

  res.send(newStreak);
})

app.put('/incrementStreak',  (req, res) => {

  console.log("incrementStreak recieved");

  streaksList.map((streak) => {
    if(streak.id == req.body.id) {

      if(streak.done == false && streak.active == true) {
        streak.count++;
        streak.done = true;
        res.send(true);
        console.log(streak)
        
      }
      else
        res.send(false);
    }
    return streak;
  })
  
})

app.put('/roundEnded',  (req, res) => {

  console.log("round end recieved");

  streaksList.map((streak) => {
    if(streak.id == req.body.id && streak.active == true) 
    {
      
      if(streak.done == true) 
      {
        if((Date.now() - new Date(streak.roundEnd)) > 86430000) { //check if more than one day has passed
          
          streak.active = false;
          res.send({
            status: false,
            message: "more than one day has passed since last deadline!!"
          });
        }
        else {
          const newRoundEnd = new Date(streak.roundEnd.setDate(streak.roundEnd.getDate()+1));
          streak.done = false;
          streak.roundEnd = newRoundEnd;
          if(streak.count > streak.highestStreak)
            streak.highestStreak = streak.count;

          res.send({
            status: true,
            message: "new round started",
            newRoundEnd: newRoundEnd
          });
        }
      }
      else {
        streak.active = false;
        res.send({
          status: false,
          message: "deadline has passed!!"
        });
      }

    }
    else if(streak.id == req.body.id){
      console.log("else was reached")
      res.send({
        status: false,
        message: "an error has occured"
      })
    }
    return streak;
  })
  
})

app.put('/retryStreak',  (req, res) => {
  console.log("retry streak")
  for(let i=0; i<streaksList.length; i++) {
    if(streaksList[i].id === req.body.id) {
      
      streaksList[i].active = true;
      if(streaksList[i].count > streaksList[i].highestStreak)
        streaksList[i].highestStreak = streaksList[i].count;
      streaksList[i].count = 0;
      streaksList[i].numberOfAttempts++;

      if(streaksList[i].roundEnd.getHours() <= new Date().getHours())
        streaksList[i].roundEnd.setDate(new Date().getDate()+1);
      else 
        streaksList[i].roundEnd.setDate(new Date().getDate());
      
      res.send({
        status: true,
        streak: streaksList[i]
      })
      break;
    }
    else if(i == streaksList.length-1) {
      res.send({status: false}) //streak could not be found
    }
  }

  
})

app.put('/deleteStreak',  (req, res) => {
  console.log("delete streak recieved")
  
  for(let i=0; i<streaksList.length; i++) {
    if(streaksList[i].id === req.body.id) {
      streaksList.splice(i, 1);
      res.send({status: true})
      break;
    }
    else if(i == streaksList.length-1) {
      res.send({status: false}) //streak could not be found
    }
  }
  
})

//allow access
app.options('/allowCors', () => {
  console.log("OPTION recieved")
});

//all print
app.all('*', (req) => {
  console.log("request at All methode: " + req.method + " URL " + req.url);
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
