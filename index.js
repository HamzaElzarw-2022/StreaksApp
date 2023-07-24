const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const {
  getStreaks,
  createNewStreak,
  incrementStreak,
  newRound,
  retryStreak,
  deleteStreak
} = require('./controllers/streakController')

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

app.get('/getStreaks', getStreaks);

app.put('/newStreaks', createNewStreak);

app.put('/incrementStreak', incrementStreak);

app.put('/roundEnded', newRound);

app.put('/retryStreak', retryStreak);

app.put('/deleteStreak', deleteStreak);

//developemnt code
app.options('/allowCors', () => {
  console.log("OPTION recieved")
});
app.all('*', (req) => {
  console.log("request at All methode: " + req.method + " URL " + req.url);
});