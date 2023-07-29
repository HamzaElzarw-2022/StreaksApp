require('dotenv').config();
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

const streakRouter = require('./routes/streakRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/streak", streakRouter)
app.use("/api/user", userRouter)

mongoose.connect(process.env.DB_URI)
.then(()=>{
  console.log("connected to DB")
  app.listen(process.env.NODE_PORT, () => {
    console.log(`server is listening on port ${process.env.NODE_PORT}`)
  })
}).catch((err) => {
  console.log(err)
})

//developemnt code
app.options('/allowCors', () => {
  console.log("OPTION recieved")
});
app.all('*', (req) => {
  console.log("request at All methode: " + req.method + " URL " + req.url);
});