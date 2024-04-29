export default class User {
  username: string;
  totalPoints: number;
  scores: { [key: string]: number };

  constructor(username: string) {
    this.username = username;
    this.totalPoints = 0;
    this.scores = {};
    for (let i = 0; i <= 10; i++) {
      this.scores[i] = -1;
    }
  }

  updateScore(lineId: number, points: number):void {
    this.scores[lineId] = points;
    this.totalPoints += points;
  }
}