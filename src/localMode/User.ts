export default class User {
  username: string;
  totalPoints: number;
  scores:any;
  color: string;

  constructor(id:number, username: string) {
    this.username = username;
    this.totalPoints = 0;
    this.scores = Array(11).fill(-1);
    this.color = getUserColor(id);
  }

  updateScore(lineId:number, score:number) {
    if (this.scores[lineId] === -1) {
      this.scores[lineId] = score;
      this.totalPoints += score;
    }
  }
}

function getUserColor(id:number) {
  const colors = ["#60a5fa", "#f87171", "#facc15", "#4ade80", "#38bdf8", "#fb923c", "#34d399", "#c084fc", "#a3e635", "#fdba74"];
  return colors[id];
}
