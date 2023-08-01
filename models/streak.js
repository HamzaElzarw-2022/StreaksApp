const { ObjectId } = require('mongodb');
const {Schema, model} = require('mongoose');

class streakObject 
{
  constructor(name, theme, roundUpdateTime, user_id) {

    this.name= name;
    this.theme= theme;
    this.user_id = user_id;

    const day = new Date().getHours() >= roundUpdateTime ? new Date().getDate()+1 : new Date().getDate();
    this.roundEnd = new Date(new Date().getFullYear(), new Date().getMonth(), day, roundUpdateTime)

    this.count= 0;
    this.highestStreak = 0;
    this.numberOfAttempts = 1;
    this.dateCreated= new Date().toString();
    this.done= false;
    this.active= true;
  }
}

const streakSchema = new Schema({

    name: String,
    theme: Number,
    count: Number,
    highestStreak: Number,
    numberOfAttempts: Number,
    dateCreated: Date,
    done: Boolean,
    active: Boolean,
    roundEnd: Date,
    user_id: ObjectId

})

const streak = model("streak", streakSchema);

module.exports = {streak, streakObject};