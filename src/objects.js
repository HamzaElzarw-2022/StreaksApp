



export class streakObject 
{
  constructor(id, name, theme, roundUpdateTime) {
    this.id= id;
    this.name= name;
    this.theme= theme;
    this.roundUpdateTime = roundUpdateTime;

    this.count= 0;
    this.dateCreated = new Date();
    this.RoundEnd = new Date();

    if(this.dateCreated.getHours() >= roundUpdateTime)
      this.RoundEnd.setDate(this.dateCreated.getDate()+1);
      
    this.RoundEnd.setHours(roundUpdateTime);
    this.RoundEnd.setMinutes(0);
    this.RoundEnd.setSeconds(0);
    this.RoundEnd.setMilliseconds(0);

    this.done= false;
    this.active= true;
  }
}

export let colors = [
    {color:"Blue", mainColor: "#91D8E4", fontColor: "#EAFDFC"},
    {color:"Green", mainColor: "#A0E4CB", fontColor: "white"},
    {color:"Gray", mainColor: "#D6E4E5", fontColor: "#497174"},
    {color:"Peach", mainColor: "#FF9F9F", fontColor: "#F2E5E5"},
    {color:"Purple", mainColor: "#DEBACE", fontColor: "#F2E5E5"},
    {color:"Yellow", mainColor: "#FFFFD0", fontColor: "#FF87B2"}
];
