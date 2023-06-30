
export class streakObject 
{
    constructor(name, color, index) {
        this.name= name;
        this.color= color;
        this.count= 0;
        this.index= index;

        this.date= "00/00/0000";
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
