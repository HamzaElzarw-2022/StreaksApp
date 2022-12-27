export class streakObject 
{
    constructor(name, color) {
        this.name= name;
        this.color= color;
        this.count= 0;
    }

    incrementCount() {
        this.count++;
        console.log(this.count);
    }
}

export let listOfStreaks = [
    new streakObject("The Streak", "#91D8E4"),
    new streakObject("The Streak", "#A0E4CB"),
    new streakObject("The Streak", "#D6E4E5"),
    new streakObject("The Streak", "#FF9F9F")
];

export let colors = [
    {value: "#91D8E4", color:"Blue", fontColor: "white"},
    {value: "#A0E4CB", color:"Green", fontColor: "white"},
    {value: "#D6E4E5", color:"Gray", fontColor: "white"},
    {value: "#FF9F9F", color:"Peach", fontColor: "white"},
]

